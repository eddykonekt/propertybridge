# Propertybridge — Tenant Communication & Maintenance Portal

A full-stack web application that replaces WhatsApp/call-based tenant communication with a structured, role-aware portal. Tenants can message property managers and submit maintenance requests; property managers can reply and manage request statuses; landlords have read-only visibility.

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Backend framework | NestJS (Node.js) | Opinionated structure, excellent DI system, decorators make guard/validation layering clean |
| ORM | TypeORM | First-class NestJS integration, decorator-based entities, auto-sync for rapid dev |
| Database | PostgreSQL | Relational integrity for users → messages → requests; mature, production-proven |
| Auth | JWT + Passport.js | Stateless, scales horizontally; no session store needed |
| Password hashing | bcrypt | Industry standard; intentionally slow to resist brute-force |
| API docs | Swagger (@nestjs/swagger) | Self-documenting, interactive — reviewers can test every endpoint without Postman |
| Frontend | React 18 + React Router v6 | Component model fits the role-based view switching well |
| HTTP client | Axios | Interceptors allow clean global token injection and 401 redirect |
| Build tool | Vite | Fast HMR, zero-config for React projects |

---

## Project Structure

```
propertybridge/
├── backend/
│   └── src/
│       ├── auth/          # JWT strategy, guards, register/login
│       ├── users/         # User entity, profile, directory
│       ├── messages/      # Thread-based messaging
│       ├── maintenance/   # Request lifecycle
│       ├── app.module.ts  # Root module + TypeORM config
│       └── main.ts        # Bootstrap + Swagger setup
└── frontend/
    └── src/
        ├── api/           # Axios client + typed API calls
        ├── context/       # AuthContext (user state, login/logout)
        ├── components/    # Sidebar, ProtectedRoute
        └── pages/         # AuthPage, Dashboard, Messages, Maintenance
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Database

```sql
CREATE DATABASE propertybridge;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and a strong JWT_SECRET

npm install
npm run start:dev
```

The API will be live at: **http://localhost:5000/api**
Swagger docs at: **http://localhost:5000/api/docs**

> `synchronize: true` is set in development — TypeORM will auto-create all tables on first run. Set this to `false` and use migrations before going to production.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

The Vite dev server proxies `/api` → `localhost:5000`, so no CORS issues during development.

---

## API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register tenant / PM / landlord |
| POST | `/api/auth/login` | Public | Get JWT token |
| GET | `/api/users/me` | Any | Current user profile |
| GET | `/api/users/admins` | Any | List PMs and landlords |
| GET | `/api/users/tenants` | Admin | List all tenants |
| POST | `/api/messages` | Any | Send a message |
| GET | `/api/messages/threads` | Any | Inbox (thread list) |
| GET | `/api/messages/thread/:id` | Any | Full thread |
| PATCH | `/api/messages/read` | Any | Mark message read |
| POST | `/api/maintenance` | Any | Submit maintenance request |
| GET | `/api/maintenance` | Any | List requests (scoped by role) |
| GET | `/api/maintenance/stats` | Admin | Counts by status |
| GET | `/api/maintenance/:id` | Any | Single request |
| PATCH | `/api/maintenance/:id` | Admin | Update status / note |

Full interactive docs: `http://localhost:5000/api/docs`

---

## Key Design Decisions

### 1. Thread model for messages
Messages have a `threadId` UUID. When a tenant sends the first message a new UUID is generated. Replies pass the same `threadId` back. This keeps the API simple (no separate `threads` table) while enabling a proper conversation view. It mirrors how email threads work — familiar and extensible.

### 2. Role-scoped data access in the service layer
Authorization isn't just at the route guard level — the service methods themselves check `userRole` before returning data. A tenant calling `GET /maintenance` only gets their own records even if they craft a raw HTTP request. Guards prevent route access; service logic enforces data ownership.

### 3. `synchronize: true` for development, migrations for production
TypeORM's auto-sync is fast for prototyping — no migration files to maintain while the schema is still evolving. The README clearly flags this must be turned off before production. In prod you'd run `typeorm migration:generate` and `migration:run`.

### 4. Landlord is view-only
The brief says landlords can "view" messages — not reply. The backend doesn't block them from calling `POST /messages` (they're authenticated), but the frontend hides the reply box for landlord role. A stricter implementation would add a `Roles(PM)` guard on the send endpoint. Left as an extension point to keep scope tight.

### 5. Broadcast messages
If a tenant doesn't pick a specific recipient, `recipientId` is `null`. Admin inbox queries include `WHERE recipientId IS NULL OR recipientId = :userId`, so all PMs see broadcast messages. This mirrors the real-world scenario where a tenant submits a general query.

---

## System Thinking — Short Answers

### 1. How would you improve this system to support real-time messaging?

Replace the polling/request-response model with **WebSockets via Socket.io**, which NestJS supports natively with `@nestjs/websockets`. When a message is saved to the database, the server emits a `new_message` event to the relevant room (keyed by `threadId`). Connected clients receive it immediately and append the bubble without a page refresh.

For scale, Socket.io can use a **Redis adapter** so multiple backend instances share the same pub/sub channel — a new message saved by instance A gets broadcast by instance B to the connected client.

The database schema requires no changes; only the delivery mechanism changes from HTTP response to WebSocket push.

### 2. What would you change if this feature had 1,000+ users?

- **Pagination**: All list endpoints would accept `?page=1&limit=20` and return cursor-based or offset pagination. Returning all records is fine at 10 users, expensive at 10,000.
- **Database indexing**: Add indexes on `messages.threadId`, `messages.senderId`, `messages.recipientId`, and `maintenance_requests.tenantId` and `status`. Without indexes, queries do full table scans as data grows.
- **Connection pooling**: Configure TypeORM's `extra.max` pool size and front the database with **PgBouncer** to handle connection spikes.
- **Caching**: Use Redis to cache frequently-read, slowly-changing data (user lists, stats counts) with a short TTL. This reduces DB load for dashboard queries.
- **Horizontal scaling**: NestJS is stateless (JWT, no sessions), so you can run multiple instances behind a load balancer (Nginx / AWS ALB) from day one. The only thing to add is a Redis adapter for WebSockets (see above).
- **File uploads**: Move image uploads from URL-paste to direct S3/Cloudflare R2 uploads with pre-signed URLs — avoids routing large binary data through the API server.

### 3. How would you ensure messages or requests are not lost?

Three layers:

1. **Database durability**: PostgreSQL with WAL (write-ahead logging) enabled by default. Every committed `INSERT` is durable even if the server crashes immediately after. Use managed Postgres (RDS, Supabase, Neon) so point-in-time recovery and automated backups are handled for you.

2. **Transactional writes**: Wrap related writes (e.g. create message + update thread's `lastMessageAt`) in a TypeORM `QueryRunner` transaction. Either both succeed or neither does — no partial state.

3. **Delivery confirmation + retry on the frontend**: The send button disables itself while the request is in-flight. If the API returns an error, the user sees it immediately and can retry. For a higher-reliability system, you'd queue the outbound message in IndexedDB (or a service worker) and retry with exponential backoff if the network is down — effectively an offline-first send queue. On the backend, a message queue (BullMQ + Redis) would decouple write acknowledgment from any downstream processing (notifications, emails) so a failed email doesn't roll back the message save.

---

## What I'd add next (out of scope for 72h)

- Email notifications when a new message arrives or maintenance status changes (Nodemailer / Resend)
- Real file upload (Multer + S3 pre-signed URLs) instead of image URL field
- Pagination on all list endpoints
- Admin tenant management (assign tenants to properties)
- Unit + e2e tests (Jest for service logic, Supertest for controllers)

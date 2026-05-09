"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Propertybridge API')
        .setDescription(`
## Tenant Communication & Maintenance Request System

A RESTful API for managing communication between **Tenants**, **Property Managers**, and **Landlords**.

### Roles
| Role | Permissions |
|------|------------|
| \`tenant\` | Send messages, view own messages, submit & view own maintenance requests |
| \`property_manager\` | View & reply to all messages, update maintenance request status |
| \`landlord\` | View all messages & maintenance requests, update status |

### Authentication
All endpoints (except \`/auth/register\` and \`/auth/login\`) require a Bearer JWT token.
Get your token by logging in via \`POST /auth/login\`, then click **Authorize** and paste: \`Bearer <your_token>\`
      `)
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Register and login')
        .addTag('Users', 'User profile and directory')
        .addTag('Messages', 'Tenant-to-admin communication threads')
        .addTag('Maintenance Requests', 'Submit and manage property maintenance issues')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'method',
        },
        customSiteTitle: 'Propertybridge API Docs',
    });
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`\n  Propertybridge API running on: http://localhost:${port}/api`);
    console.log(`  Swagger docs:              http://localhost:${port}/api/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Propertybridge API')
    .setDescription(
      `
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
      `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Register and login')
    .addTag('Users', 'User profile and directory')
    .addTag('Messages', 'Tenant-to-admin communication threads')
    .addTag('Maintenance Requests', 'Submit and manage property maintenance issues')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
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

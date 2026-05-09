import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { User } from './users/user.entity';
import { Message } from './messages/message.entity';
import { MaintenanceRequest } from './maintenance/maintenance-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'property',
      password: process.env.DB_PASSWORD || 'propertybridgeDB',
      database: process.env.DB_NAME || 'propertybridge',
      entities: [User, Message, MaintenanceRequest],
      synchronize: true, // Set to false in production; use migrations
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
    MaintenanceModule,
  ],
})
export class AppModule {}

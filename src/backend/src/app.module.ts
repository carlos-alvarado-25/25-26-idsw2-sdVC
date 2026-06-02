import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Usuario } from './entities/usuario.entity';
import { Grado } from './entities/grado.entity';
import { AuthModule } from './modules/auth/auth.module';
import { GradoModule } from './modules/grados/grados.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'generador_calendarios',
      entities: [Usuario, Grado],
      synchronize: false,
    }),
    AuthModule,
    GradoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

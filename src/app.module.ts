import { TypegooseModule } from 'nestjs-typegoose'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getMongoDb } from './config/mongo.config'
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoDb
		}),
		AuthModule,
		UserModule
	],
	controllers: [AppController, UserController],
	providers: [AppService, UserService]
})
export class AppModule {}

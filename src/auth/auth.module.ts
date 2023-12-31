import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose'
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModel } from 'src/user/user.model'

@Module({
	providers: [AuthService],
	controllers: [AuthController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'user'
				}
			}
		]),
        ConfigModule,
	]
})
export class AuthModule {}

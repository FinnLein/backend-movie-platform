import { Module } from '@nestjs/common'
import { ActorController } from './actor.controller'
import { ActorService } from './actor.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { ActorModel } from './actor.model'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ActorModel,
				schemaOptions: {
					collection: 'Actor'
				}
			},
			ConfigModule
		])
	],
	controllers: [ActorController],
	providers: [ActorService]
})
export class ActorModule {}

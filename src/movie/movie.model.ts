import { Ref, prop } from '@typegoose/typegoose'
import { ActorModel } from 'src/actor/actor.model'
import { GenreModel } from 'src/genre/genre.model'

export class Parametrs {
	@prop()
	year: number

	@prop()
	duration: number

	@prop()
	country: number
}

export class MovieModel {
	@prop()
	poster: string

	@prop()
	bigPoster: string

	@prop()
	name: string

    @prop({ unique: true })
	title: string

	@prop({ unique: true })
	slug: string

	@prop()
	parametres?: Parametrs

	@prop()
	videoUrl: string

	@prop({ ref: () => GenreModel })
	genres: Ref<GenreModel>[]

	@prop({ ref: () => ActorModel })
	actors: Ref<ActorModel>[]

	@prop({ default: false })
	isSendTelegram?: boolean

	@prop({ default: 4.0 })
	rating?: number

	@prop({ default: 0 })
	countOpened?: number
}

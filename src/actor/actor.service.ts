import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ActorModel } from './actor.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorDto } from './actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async bySlug(slug: string) {
		const actor = await this.ActorModel.findOne({ slug }).exec()
		if (!actor) throw new NotFoundException('Actor not found')
		return actor
	}

	async byId(_id: string) {
		const actor = await this.ActorModel.findById(_id)

		if (!actor) throw new NotFoundException('Actor not found')

		return actor
	}

	async getAll(seatchTerm?: string) {
		let options = {}

		if (seatchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(seatchTerm, 'i')
					},
					{
						slug: new RegExp(seatchTerm, 'i')
					},
					{
						description: new RegExp(seatchTerm, 'i')
					}
				]
			}
		}

		return this.ActorModel.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				foreignField: 'actors',
				localField: '_id',
				as: 'movies'
			})
			.addFields({
				countMovies: {
					$size: '$movies'
				}
			})
			.project({
				__v: 0,
				updatedAt: 0,
				movies: 0
			})
			.sort({
				createdAt: -1
			})
			.exec()
	}

	// admin place

	async createActor() {
		const defaultValues: ActorDto = {
			name: '',
			slug: '',
			photo: ''
		}

		const actor = await this.ActorModel.create(defaultValues)
		return actor._id
	}

	async updateActor(_id: string, dto: ActorDto) {
		const actor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()
	}

	async deleteActor(_id: string) {
		const actor = await this.ActorModel.findByIdAndDelete(_id).exec()
	}
}

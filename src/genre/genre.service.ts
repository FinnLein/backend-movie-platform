import { MovieService } from './../movie/movie.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGenreDto } from './dto/create-genre.dto'
import { Collection } from './genre.interface'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly MovieService: MovieService
	) {}

	async bySlug(slug: string) {
		const genre = await this.GenreModel.findOne({ slug })
		if (!genre) throw new NotFoundException('Actor not found')
		return genre
	}

	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id)
		if (!genre) throw new NotFoundException('Genre not found')
		return genre
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

		return this.GenreModel.find(options)
			.select('-__v, -updatedAt')
			.sort({
				createdAt: 'desc'
			})
			.exec()
	}

	async getCollections():Promise<Collection[]> {
		const genres = await this.getAll()

		const collections = await Promise.all(
			genres.map(async (genre) => {
				const moviesByGenre = await this.MovieService.byGenres([genre._id])

				const result: Collection = {
					_id: String(genre._id),
					title: genre.name,
					slug: genre.slug,
					image: moviesByGenre[0]?.poster
				}

				return result
			})
		)

		return collections
	}

	// admin place

	async createGenre() {
		const defaultValues: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: ''
		}

		const genre = await this.GenreModel.create(defaultValues)
		return genre._id
	}

	async updateGenre(
		id: string,
		dto: CreateGenreDto
	): Promise<GenreModel> | null {
		return this.GenreModel.findByIdAndUpdate(id, dto, { new: true }).exec()
	}

	async deleteGengre(_id: string) {
		const genre = await this.GenreModel.findByIdAndDelete(_id).exec()
	}
}

import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateProfileDto } from './dto/updateProfile.dto'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) {}

	async byId(_id: string) {
		const user = await this.userModel.findById(_id)

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async updateProfile(_id: string, dto: UpdateProfileDto) {
		const user = await this.byId(_id)

		const isSameUser = await this.userModel.findOne({ email: dto.email })

		if (isSameUser && String(_id) !== String(isSameUser._id))
			throw new NotFoundException('Email is busy')

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}
		
		user.email = dto.email

		if (dto.isAdmin || dto.isAdmin === false) {
			user.isAdmin = dto.isAdmin
		}

		user.save()

		return
	}

	async getCount() {
		return this.userModel.find().count().exec()
	}

	async delete(id: string) {
		return this.userModel.findByIdAndDelete(id).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}
		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.userModel
			.find(options)
			.select('-updatedAt -__v -password')
			.sort({
				createdAt: 'desc'
			})
			.exec()
	}

	async toggleFavorites(movieId: Types.ObjectId, user: UserModel) {
		const { _id, favorites } = user

		await this.userModel.findByIdAndUpdate(_id, {
			favorites: favorites.includes(movieId)
				? favorites.filter(id => {
						String(id) !== String(movieId)
				  })
				: [...favorites, movieId]
		})
	}

	async getFavoriteMovies(id: Types.ObjectId) {
		return this.userModel
			.findById(id, 'favorites')
			.populate({
				path: 'favorites',
				populate: {
					path: 'genres'
				}
			})
			.exec()
			.then(data => data.favorites)
	}
}

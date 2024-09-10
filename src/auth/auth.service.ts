import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import {
	BadRequestException,
	UnauthorizedException
} from '@nestjs/common/exceptions'

import { UserModel } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'
import { genSalt, hash, compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { RefreshhDto } from './dto/refreshToke.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}
	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({
			email: dto.email
		})

		if (oldUser) {
			throw new BadRequestException(
				'User with this email already have registered in the system'
			)
		}

		const salt = await genSalt(10)

		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt)
		})

		const user = await newUser.save()

		const tokens = await this.createTokenPair(String(user._id))

		return {
			user: this.getUserFields(user),
			...tokens
		}
	}

	async validateLogin(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({
			email: dto.email
		})

		if (!user) throw new UnauthorizedException('User not found')

		const isValidPassword = await compare(dto.password, user.password)

		if (!isValidPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	async login(dto: AuthDto) {
		const user = await this.validateLogin(dto)

		const tokens = await this.createTokenPair(String(user._id))

		return {
			user: this.getUserFields(user),
			...tokens
		}
	}

	async createTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d'
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h'
		})

		return { refreshToken, accessToken }
	}

	getUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin
		}
	}

	async getNewTokens({refreshToken}: RefreshhDto){
		if(!refreshToken) throw new UnauthorizedException("Please sign in")

		const result = await this.jwtService.verifyAsync(refreshToken)
		if(!result) throw new UnauthorizedException("Invalid token or expired")

		const user = await this.UserModel.findById(result._id)

		const tokens = await this.createTokenPair(String(user._id))

		return {
			user: this.getUserFields(user),
			...tokens
		}
	}
}

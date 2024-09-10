import { UpdateProfileDto } from './dto/updateProfile.dto'
import { UserService } from './user.service'
import { Controller, ValidationPipe } from '@nestjs/common'
import {
	HttpCode,
	Get,
	UsePipes,
	Put,
	Body,
	Param,
	Delete,
	Query
} from '@nestjs/common/decorators'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipes'
import { Types } from 'mongoose'
import { UserModel } from './user.model'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Get('profile')
	async getProfle(@User('_id') _id: string) {
		return this.userService.byId(_id)
	}

	@Auth()
	@Get('profile/favorites')
	async getFavoites(@User('_id') _id: Types.ObjectId) {
		return this.userService.getFavoriteMovies(_id)
	}

	@Auth('admin')
	@Get('count')
	async getCount() {
		return this.userService.getCount()
	}

	@Auth('admin')
	@Get()
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}

	@Auth('admin')
	@Get(':id')
	async getUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async UpdateProfile(@User('_id') _id: string, @Body() dto: UpdateProfileDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@Put('profile/favorites')
	@HttpCode(200)
	@Auth()
	async toggleFavorites(@Body('movieId', IdValidationPipe) movieId: Types.ObjectId, @User() user: UserModel) {
		return this.userService.toggleFavorites(movieId, user)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async UpdateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateProfileDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Delete(':id')
	@Auth('admin')
	async DeleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.delete(id)
	}
}

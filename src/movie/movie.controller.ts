import { Auth } from './../auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipes'
import { MovieService } from './movie.service'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { updateMovieDto } from './updateMovie.dto'

@Controller('movies')
export class MovieController {
	constructor(private readonly MovieService: MovieService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.MovieService.bySlug(slug)
	}

	@Get('by-actor/:actorId')
	async getByActor(@Param('actorId', IdValidationPipe) actor: Types.ObjectId) {
		return this.MovieService.byActor(actor)
	}

	@Post('by-genres')
	@HttpCode(200)
	async byGenres(
		@Body('genreIds')
		genreIds: Types.ObjectId[]
	) {
		return this.MovieService.byGenres(genreIds)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.MovieService.getAll(searchTerm)
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.MovieService.getMostPopular()
	}

	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.MovieService.updateCountOpened(slug)
	}

	@Get(':id')
	@Auth('admin')
	async byId(@Param('id', IdValidationPipe) id: string) {
		return this.MovieService.byId(id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.MovieService.create()
	}

	

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateMovie(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: updateMovieDto
	) {
		const updateMovie = await this.MovieService.update(id, dto)
		if (!updateMovie) throw new NotFoundException('Movie not found')
		return updateMovie
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteMovie(@Param('id') id: string) {
		return this.MovieService.deleteMovie(id)
	}
}

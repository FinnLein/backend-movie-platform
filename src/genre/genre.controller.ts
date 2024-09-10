import { Auth } from 'src/auth/decorators/auth.decorator'
import { GenreService } from './genre.service'
import {
	Controller,
	Get,
	Param,
	Query,
	UsePipes,
	ValidationPipe,
	Put,
	HttpCode,
	Body,
    Delete,
    Post
} from '@nestjs/common'
import { IdValidationPipe } from 'src/pipes/id.validation.pipes'
import { CreateGenreDto } from './dto/create-genre.dto'

@Controller('genres')
export class GenreController {
	constructor(private readonly GenreService: GenreService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.GenreService.bySlug(slug)
	}

	@Get('collections')
	async getCollections() {
		return this.GenreService.getCollections()
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.GenreService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.GenreService.byId(id)
	}

    @Post()
    @HttpCode(200)
    @Auth('admin')
    async createGenre(){
        return this.GenreService.createGenre()
    }

	@Put(':id')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	async updateGenre(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
        return this.GenreService.updateGenre(id, dto)
    }

    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async deleteGenre(@Param('id') id: string){
        return this.GenreService.deleteGengre(id)
    }
}

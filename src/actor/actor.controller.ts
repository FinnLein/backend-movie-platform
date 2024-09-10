import { Auth } from 'src/auth/decorators/auth.decorator'
import { ActorService } from './actor.service'
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
import { ActorDto } from './actor.dto'


@Controller('actors')
export class ActorController {
	constructor(private readonly ActorService: ActorService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.ActorService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.ActorService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.ActorService.byId(id)
	}

    @Post()
    @HttpCode(200)
    @Auth('admin')
    async createActor(){
        return this.ActorService.createActor()
    }

	@Put(':id')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	async updateActor(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: ActorDto
	) {
        return this.ActorService.updateActor(id, dto)
    }

    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async deleteActor(@Param('id') id: string){
        return this.ActorService.deleteActor(id)
    }
}

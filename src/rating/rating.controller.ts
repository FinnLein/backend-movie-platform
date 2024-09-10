import { Auth } from 'src/auth/decorators/auth.decorator'
import { RatingService } from './rating.service'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { User } from 'src/user/decorators/user.decorator'
import { SetRatingDTo } from './setRating.dto'

@Controller('ratings')
export class RatingController {
	constructor(private readonly RatingService: RatingService) {}

	@Get(':movieId')
	@Auth()
	async getMovieValueByUser(
		@Param('movieId') movieId: Types.ObjectId,
		@User('_id') _id: Types.ObjectId
	) {
		return this.RatingService.getMovieValueByUser(movieId, _id)
	}

	@Post('set-rating')
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async setRating(@User('_id') _id: Types.ObjectId, @Body() dto: SetRatingDTo) {
		return this.RatingService.setRating(_id, dto)
	}
}

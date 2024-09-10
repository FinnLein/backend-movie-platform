import { IsNumber, IsString,  } from 'class-validator'


export class SetRatingDTo {
	@IsString()
	movieId: string

	@IsNumber()
	value: number
}

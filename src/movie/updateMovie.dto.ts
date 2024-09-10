import { IsArray, IsNumber, IsObject, IsString } from 'class-validator'

export class Parameters{
    @IsNumber()
    year: number

    @IsNumber()
    duration: number

    @IsString()
    country: string
}

export class updateMovieDto {
	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsString()
	title: string

	description: string

	@IsObject()
	parameters?: Parameters

	@IsArray()
	@IsString({ each: true })
	genres: string[]

	@IsArray()
	@IsString({ each: true })
	actors: string[]

	@IsString()
	videoUrl: string

	@IsString()
	slug: string

	isSendTelegram?: boolean
}

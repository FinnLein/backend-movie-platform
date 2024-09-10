import { IsString } from 'class-validator'

export class RefreshhDto {
	@IsString({ message: 'You did not have refresh token or it is not a string' })
	refreshToken: string
}

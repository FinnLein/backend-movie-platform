import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export const getJwt = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: configService.get("JWT")
})

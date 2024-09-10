import { TypeRole } from '../auth.inteface'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { jwtGuard } from '../guards/jwt.guard'
import { onlyAdminGuard } from '../guards/admin.guard'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin' ? UseGuards(jwtGuard, onlyAdminGuard) : UseGuards(jwtGuard)
	)

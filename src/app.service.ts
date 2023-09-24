import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	getText(): object {
		return { text: 'Hello htmllessons!' }
	}
}

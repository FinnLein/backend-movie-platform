import { FileService } from './file.service'
import { Controller } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import {
	Post,
	HttpCode,
	UploadedFile,
	Query,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FileController {
	constructor(private readonly FileService: FileService) {}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	@UseInterceptors(FileInterceptor('file'))
	async createFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return this.FileService.saveFiles([file], folder)
	}
}

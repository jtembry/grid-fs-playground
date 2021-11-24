import { Injectable, Logger } from '@nestjs/common';
import { AppRepository } from './app.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly appRepository: AppRepository,
    private logger: Logger
    ) {}

  async getAllFiles(fileType) {
    return await this.appRepository.getAllFiles(fileType)
  }

  async getFile(name) {
    return await this.appRepository.getFile(name)
  }

  async saveFile(file, body) {
    return await this.appRepository.saveFile(file.originalname, file.buffer, file.mimetype, body.tags)
  }
}

import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository) {}

  async getAllFiles() {
    return await this.appRepository.getAllFiles()
  }

  async getFile(name) {
    return await this.appRepository.getFile(name)
  }

  async saveFile(file) {
    return await this.appRepository.saveFile(file.originalname, file.buffer.toString())
  }
}


import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AppService } from './app.service';
import { SampleDto } from './sample.dto';
import { Multer } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('files')
  async getAllFiles(){
    const files = this.appService.getAllFiles();
    return files;
  }

  @Get(':id')
  async getFile(@Param() params) {
    console.log('params', params.id)
    const file = this.appService.getFile(params.id);
    return file
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('file', file)
      return {
        body,
        response_id: await this.appService.saveFile(file)
  }
}
}
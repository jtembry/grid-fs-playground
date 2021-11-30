
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
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
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
    ) {}

  @Get('files')
  async getAllFiles(@Query() qp: string){
    this.logger.log(`Filtering on: ${qp['fileType']}`)
    const files = this.appService.getAllFiles(qp['fileType']);
    return files;
  }

  @Get(':id')
  async getFile(
    @Param() params,
    @Query() qp: string
    ) {
    this.logger.log(`Filtering on: ${qp['uploadDate']}`)
    return await this.appService.getFile(params.id, qp['uploadDate']);
  }

  @Delete(':id')
  async deleteFile(
    @Param() params,
    ) {
    this.logger.log(`Deleting: ${params.id}`)
    return {
      response: await this.appService.deleteFile(params.id)
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
      return {
        response: await this.appService.saveFile(file, body)
  }
}
}
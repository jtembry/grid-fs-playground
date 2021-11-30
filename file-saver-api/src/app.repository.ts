import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Connection } from "mongoose";
import { resolve } from "path/posix";
import { Readable, Writable } from "stream";

export const MONGO_COLLECTION = "collection";
export const MONGO_BUCKET = "bucket";

@Injectable()
export class AppRepository {
    constructor(
    @InjectConnection() private connection: Connection,
    private logger: Logger
    ){}

    public async saveFile(file, tags: []): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const stream = new Readable();
            stream.push(file.buffer);
            stream.push(null);
            
            // open stream to grid fs bucket
            const dbHandle = this.connection.db
            const gridFsBucket = new GridFSBucket(dbHandle, {
                bucketName: MONGO_BUCKET,
            });
            // write data to grid fs
            stream
                .pipe(gridFsBucket.openUploadStream(file.originalname, 
                    { 
                        metadata: {
                            'mimeType': file.mimetype,
                            'tags': tags
                        }
                    }
                ))
                .on("finish", (resp: any) => {
                    resolve('success ' + resp._id.toHexString());
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    public async getFile(fileName, uploadDate?): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const dbHandle = this.connection.db
            const gridFsBucket = new GridFSBucket(dbHandle, {
                bucketName: MONGO_BUCKET,
            });

            // hold base64 string
            let data = "";
            // create writable stream that will append to data the chunks from gridfs.
            const writableStream = new Writable({
                write(chunk, _encoding, callback) {
                    data += chunk.toString("base64");
                    callback();
                },
            });
     
            const openDowloadStream = (file) => {
                gridFsBucket.openDownloadStream(file._id)
                .pipe(writableStream)
                .on("finish", () => {
                    resolve({
                        fileName: file.filename,
                        metaData: file.metadata,
                        uploadDate: file.uploadDate,
                        fileData: data,
                    });
                })
                .on("error", (err) => {
                    reject(err.message);
                });
            }
            
            const file = await gridFsBucket.find({
                filename: fileName,
                uploadDate: { $eq: new Date(uploadDate)}
            })
            .toArray().then(fileArray => {
                openDowloadStream(fileArray.pop())
            })
        });
    }

    public async getAllFiles(fileType: string): Promise<Array<any>> {
        return new Promise<Array<any>>(async (resolve, reject) => {
            const dbHandle = this.connection.db
            const gridFsBucket = new GridFSBucket(dbHandle, {
                bucketName: MONGO_BUCKET,
            });
            const filter = fileType !== '' ? {"metadata.mimeType": fileType} : {}
            console.log('filter', filter)
            const cursor = gridFsBucket.find(filter)
            resolve(cursor.toArray())
        });
    }

    public async deleteFile(fileId: string) {
        return new Promise (async (resolve, reject) => {
            const dbHandle = this.connection.db

            const gridFsBucket = new GridFSBucket(dbHandle, {
                bucketName: MONGO_BUCKET,
            });
            gridFsBucket.delete(new ObjectId(fileId), (err) => {
                if (err) {
                    reject("Unable to delete file");
                } else {
                    resolve("File Deleted");
                }
            });
        })
    }
}

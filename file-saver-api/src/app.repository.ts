import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { createReadStream, createWriteStream } from "fs";
import { MongoError, GridFSBucket, ObjectId } from "mongodb";
import { Connection } from "mongoose";
import { Readable, Writable } from "stream";

export const MONGO_COLLECTION = "collection";
export const MONGO_BUCKET = "bucket";

@Injectable()
export class AppRepository {
    constructor(
    @InjectConnection() private connection: Connection
    ){}

    public async saveFile(fileName: string, data: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            // read utf-8 string to buffer
            const buffer = Buffer.from(data, "utf-8");
            const stream = new Readable();
            // convert buffer to binary string and write to readable stream
            stream.push(buffer.toString("binary"));
            stream.push(null);

            // open stream to grid fs bucket
            const dbHandle = this.connection.db
            const gridFsBucket = new GridFSBucket(dbHandle, {
                bucketName: MONGO_BUCKET,
            });
            // write data to grid fs
            stream
                .pipe(gridFsBucket.openUploadStream(fileName, {}))
                .on("finish", (resp: any) => {
                    resolve(resp._id.toHexString());
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    public async getFile(name): Promise<any> {
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
                    data += chunk.toString("utf-8");
                    callback();
                },
            });
            const file = gridFsBucket.openDownloadStreamByName(name)
            .pipe(writableStream)
            .on("finish", () => {
                console.log('data out', data)
                resolve({
                    fileName: name,
                    fileData: data,
                });
            })
            .on("error", (err) => {
                reject(err.message);
            });
    });
    }

    public async getAllFiles(): Promise<Array<any>> {
        return new Promise<Array<any>>(async (resolve, reject) => {
            const dbHandle = this.connection.db
            const gridFsBucket = new GridFSBucket(dbHandle, {
                bucketName: MONGO_BUCKET,
            });
            const cursor = gridFsBucket.find({})
            resolve(cursor.toArray())
        });
    }

    // public async getBpmnFile(
    //     fileId: string,
    // ): Promise<{
    //     fileName: string;
    //     fileData: string;
    // }> {
    //     return new Promise<{
    //         fileName: string;
    //         fileData: string;
    //     }>(async (resolve, reject) => {
    //         const dbHandle = this.connection.db
    //         const gridFsBucket = new GridFSBucket(dbHandle, {
    //             bucketName: AOW_ADMIN_BUCKET,
    //         });

    //         const file = await gridFsBucket
    //             .find({
    //                 _id: new ObjectId(fileId),
    //             })
    //             .toArray();

    //         let filename: string = "";
    //         if (Array.isArray(file) && file.length > 0) {
    //             filename = file[0].filename;
    //         } else {
    //             throw new Error("File not found");
    //         }

    //         // hold base64 string
    //         let data = "";
    //         // create writable stream that will append to data the chunks from gridfs.
    //         const writableStream = new Writable({
    //             write(chunk, _encoding, callback) {
    //                 data += chunk.toString("base64");
    //                 callback();
    //             },
    //         });
    //         // open download stream and write data to write stream.
    //         gridFsBucket
    //             .openDownloadStream(new ObjectId(fileId))
    //             .pipe(writableStream)
    //             .on("finish", () => {
    //                 resolve({
    //                     fileName: filename,
    //                     fileData: data,
    //                 });
    //             })
    //             .on("error", (err) => {
    //                 reject(err.message);
    //             });
    //     });
    // }

    public async deleteBpmnFile(fileId: string) {
        try {
            const dbHandle = this.connection.db

            const gridFsBucket = new GridFSBucket(dbHandle, {
                bucketName: MONGO_BUCKET,
            });

            gridFsBucket.delete(new ObjectId(fileId), (err) => {
                if (err) {
                    throw new Error("Unable to delete file");
                }
            });
            throw new Error("Unable to delete file");
        } catch (err) {
        throw new Error("Unable to delete file");
    }
}
}
import { FastifyInstance } from 'fastify'
import { _Object, Bucket } from '@aws-sdk/client-s3'

import { getObjectsInBucket, getObjectByKey/* , createFolder, deleteObject */ } from '../lib/s3'
import { AWSRegion, AWSRegions, type DataFolder, type DataFile } from 'types'

export default async function objectRoutes(server: FastifyInstance) {
    server.get<{
        Querystring: {}
        Headers: {
            'x-aws-access-key-id': string,
            'x-aws-secret-access-key': string,
            'x-aws-region': string,
        }
        Body: {}
        Params: {
            '*': string
        }
        Reply: {
            200: {
                success: boolean,
                data: { objects: DataFile[], folders: DataFolder[] }
            },
            400: {
                success: boolean,
                error: string,
            },
        }
    }>('/buckets/*', async (request, reply) => {
        if (!request.headers['x-aws-access-key-id'] || !request.headers['x-aws-secret-access-key'] || !request.headers['x-aws-region']) {
            return reply
                .code(400)
                .send({
                    success: false,
                    error: 'Missing AWS credentials.',
                })
        }

        if (!Object.keys(AWSRegions).includes(request.headers['x-aws-region'] as string)) {
            return reply
                .code(400)
                .send({
                    success: false,
                    error: `Invalid AWS region. Valid regions are: ${Object.keys(AWSRegions).join(', ')}`,
                })
        }

        const { '*': path } = request.params
        const [bucket, ..._folders] = path.split('/').filter(Boolean)

        const { objects, folders, error } = await getObjectsInBucket({
            accessKeyId: request.headers['x-aws-access-key-id'] as string,
            secretAccessKey: request.headers['x-aws-secret-access-key'] as string
        }, request.headers['x-aws-region'] as AWSRegion, bucket, _folders)

        if (error) {
            return reply
                .code(400)
                .send({
                    success: false,
                    error,
                })
        }

        return reply
            .code(200)
            .send({
                success: true,
                data: {
                    objects,
                    folders,
                },
            })
    })

    server.get<{
        Querystring: {
            download: string
        }
        Headers: {
            'x-aws-access-key-id': string
            'x-aws-secret-access-key': string
            'x-aws-region': string
            'content-type': string
            'content-length': string
            'etag': string
            'content-disposition': string
        }
        Body: {}
        Params: {
            bucketName: string
            '*': string
        }
        Reply: {
            200: NodeJS.ReadableStream
            400: {
                success: boolean
                error: string
            },
            302: {}
        }
    }>('/objects/:bucketName/*', async (request, reply) => {
        if (!request.headers['x-aws-access-key-id'] || !request.headers['x-aws-secret-access-key'] || !request.headers['x-aws-region']) {
            return reply
                .code(400)
                .send({
                    success: false,
                    error: 'Missing AWS credentials.',
                })
        }

        if (!Object.keys(AWSRegions).includes(request.headers['x-aws-region'] as string)) {
            return reply
                .code(400)
                .send({
                    success: false,
                    error: `Invalid AWS region. Valid regions are: ${Object.keys(AWSRegions).join(', ')}`,
                })
        }

        const { bucketName, '*': objectKey } = request.params
        const { download } = request.query

        const res = await getObjectByKey({
            accessKeyId: request.headers['x-aws-access-key-id'] as string,
            secretAccessKey: request.headers['x-aws-secret-access-key'] as string
        }, request.headers['x-aws-region'] as AWSRegion, bucketName, objectKey)
        const stream = res.Body as NodeJS.ReadableStream
        const shouldDownload = download === 'true'
        if (!stream) {
            return reply
                .code(400)
                .send({
                    success: false,
                    error: 'Object not found or no stream available',
                })
        }

        return reply
            .headers({
                'content-type': res.ContentType || 'application/octet-stream',
                'content-length': res.ContentLength?.toString() || '',
                'content-disposition': shouldDownload ? 'attachment' : '',
                'etag': res.ETag || '',
            })
            .code(200)
            .send(stream)
    })

    // server.post<{
    //     Querystring: {}
    //     Headers: {}
    //     Body: {}
    //     Params: {
    //         bucketName: string
    //         '*': string
    //     }
    //     Reply: {
    //         200: { success: boolean }
    //         302: {}
    //     }
    // }>('/objects/:bucketName/*', async (request, reply) => {
    //     const { bucketName, '*': objectKey } = request.params

    //     // todo: check for duplicates
    //     await createFolder(bucketName, objectKey)

    //     return reply
    //         .code(200)
    //         .send({ success: true })
    // })

    // server.delete<{
    //     Querystring: {}
    //     Headers: {}
    //     Body: {}
    //     Params: {
    //         bucketName: string
    //         '*': string
    //     }
    //     Reply: {
    //         200: { success: boolean }
    //         302: {}
    //     }
    // }>('/objects/:bucketName/*', async (request, reply) => {
    //     const { bucketName, '*': objectKey } = request.params

    //     // @ts-ignore
    //     await deleteObject(bucketName, objectKey)

    //     return reply
    //         .code(200)
    //         .send({ success: true })
    // })
}

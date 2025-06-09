import { FastifyInstance } from 'fastify'

import { getBuckets } from '../lib/s3'
import { type AWSRegion, AWSRegions, DataBucket } from 'types'

export default async function bucketRoutes(server: FastifyInstance) {
    server.get<{
        Querystring: {}
        Headers: {
            'x-aws-access-key-id': string,
            'x-aws-secret-access-key': string,
            'x-aws-region': string,
        }
        Body: {}
        Params: {}
        Reply: {
            200: {
                success: boolean,
                data: {
                    buckets: DataBucket[],
                }
            },
            400: {
                success: boolean,
                error: string,
            },
        }
    }>('/buckets', async (request, reply) => {
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

        const { buckets, error } = await getBuckets({
            accessKeyId: request.headers['x-aws-access-key-id'] as string,
            secretAccessKey: request.headers['x-aws-secret-access-key'] as string
        }, request.headers['x-aws-region'] as AWSRegion)

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
                data: { buckets },
            })
    })
}

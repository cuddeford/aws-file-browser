import {
    S3Client,
    // PutObjectCommand,
    // CreateBucketCommand,
    // DeleteObjectCommand,
    // DeleteBucketCommand,
    paginateListObjectsV2,
    // paginateListBuckets,
    GetObjectCommand,
    // Bucket,
    ListBucketsCommand,
} from '@aws-sdk/client-s3'

import { type DataBucket, type DataFile, type DataFolder, AWSCredentials, AWSRegion } from 'types'

export const getBuckets = async (credentials: AWSCredentials, region: AWSRegion): Promise<{ buckets: DataBucket[], error?: string }> => {
    const s3Client = new S3Client({
        region,
        credentials,
    })

    try {
        const res = await s3Client.send(new ListBucketsCommand({
            'BucketRegion': region,
        }))

        if (!res?.Buckets || res.Buckets.length === 0) {
            return {
                buckets: [],
            }
        }

        const buckets: DataBucket[] = res.Buckets.map(bucket => ({
            name: bucket.Name!,
            bucketRegion: bucket.BucketRegion!,
            createdAt: bucket.CreationDate!,
            type: 'bucket',
        }))

        return {
            buckets,
        }
    } catch (error: any) {
        if (error?.Code === 'PermanentRedirect') {
            return {
                buckets: [],
                error: 'This bucket is not accessible from this region.',
            }
        }

        if (error?.Code === 'InvalidAccessKeyId' || error?.Code === 'SignatureDoesNotMatch') {
            return {
                buckets: [],
                error: 'Invalid AWS credentials',
            }
        }

        return {
            buckets: [],
            error: 'Unknown error occurred while fetching buckets',
        }
    }
}

export const getObjectsInBucket = async (credentials: AWSCredentials, region: AWSRegion, bucketName: string, folders?: string[]): Promise<{
    objects: DataFile[]
    folders: DataFolder[]
    error?: string
}> => {
    const foldersString = (folders || []).join('/')
    const foldersPath = foldersString ? `${foldersString}/` : ''

    const s3Client = new S3Client({
        region,
        credentials,
    })

    try {
        // Paginate all objects inside a bucket
        const paginator = paginateListObjectsV2(
            { client: s3Client },
            {
                Bucket: bucketName,
                Delimiter: '/',
                Prefix: foldersPath,
            },
        )

        const bucketObjects = []
        const folderObjects = []
        for await (const page of paginator) {
            const objects = page.Contents
            const folders = page.CommonPrefixes?.filter(folder => folder.Prefix)
            if (objects) {
                bucketObjects.push(...objects)
            }

            if (folders) {
                folderObjects.push(...folders)
            }

            // Only fetch the first page until we can implement pagination in the UI
            // otherwise we risk returning too many objects in a large bucket
            break
        }

        return {
            objects: bucketObjects
                .map(object => ({ name: object.Key, updatedAt: object.LastModified, size: object.Size, type: 'object' } as DataFile))
                .filter(object => object.name !== foldersPath),
            folders: folderObjects
                .map(folder => ({ name: folder.Prefix!, type: 'folder' } as DataFolder))
                .filter(folder => folder.name !== foldersPath),
        }
    } catch (error: any) {
        if (error?.Code === 'PermanentRedirect') {
            return {
                objects: [],
                folders: [],
                error: 'This bucket is not accessible from this region.',
            }
        }

        if (error?.Code === 'InvalidAccessKeyId' || error?.Code === 'SignatureDoesNotMatch') {
            return {
                objects: [],
                folders: [],
                error: 'Invalid AWS credentials',
            }
        }

        return {
            objects: [],
            folders: [],
            error: 'Unknown error occurred while fetching objects',
        }
    }
}

export const getObjectByKey = async (credentials: AWSCredentials, region: AWSRegion, bucketName: string, objectKey: string) => {
    try {
        const s3Client = new S3Client({
            region,
            credentials,
        })

        const res = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: objectKey,
            })
        )

        return res
    } catch (error: any) {
        if (error?.Code === 'PermanentRedirect') {
            throw new Error('This bucket is not accessible from this region.')
        }

        if (error?.Code === 'InvalidAccessKeyId' || error?.Code === 'SignatureDoesNotMatch') {
            throw new Error('Invalid AWS credentials')
        }

        throw new Error('Unknown error occurred while fetching object')
    }
}

// export const createFolder = async (credentials: AWSCredentials, region: AWSRegion, bucketName: string, objectKey: string) => {
//     const s3Client = new S3Client({
//         region,
//         credentials,
//     })

//     const res = await s3Client.send(
//         new PutObjectCommand({
//             Bucket: bucketName,
//             Key: objectKey.endsWith('/') ? objectKey : `${objectKey}/`,
//             Body: '',
//         }),
//     )

//     return res
// }

// export const deleteObject = async (credentials: AWSCredentials, region: AWSRegion, bucketName: string, objectKey: string) => {
//     const s3Client = new S3Client({
//         region,
//         credentials,
//     })

//     const res = await s3Client.send(
//         new DeleteObjectCommand({ Bucket: bucketName, Key: objectKey }),
//     )

//     return res
// }

// Delete bucket
// await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }))

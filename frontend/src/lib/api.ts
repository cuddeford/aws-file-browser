import type { DataBucket, DataFolder, DataFile } from 'types'

const SERVER_URL = 'http://localhost:3000'
const endpoint = (path: string) => `${SERVER_URL}/api/${path}`

const headers = () => ({
    'x-aws-access-key-id': window.localStorage.getItem('aws-file-browser-key-id') || '',
    'x-aws-secret-access-key': window.localStorage.getItem('aws-file-browser-secret-key') || '',
    'x-aws-region': window.localStorage.getItem('aws-file-browser-region') || '',
})

// Add an artificial delay to simulate network latency to smooth out the loading spinner
// TODO: fix
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const artificialDelay = 500

export const getBuckets = async (): Promise<{ buckets: DataBucket[] }> => {
    await sleep(artificialDelay)

    const req = await fetch(endpoint('buckets'), {
        method: 'GET',
        headers: headers(),
    })

    const res = await req.json()

    if (res.success) {
        return res.data
    }

    throw new Error(res.message || res.error || 'Failed to fetch objects')
}

export const getObjects = async (bucketName: string, folders: string): Promise<{ objects: DataFile[], folders: DataFolder[] }> => {
    await sleep(artificialDelay)

    const path = `/${bucketName}/${folders}`
    const req = await fetch(endpoint('buckets' + path), {
        method: 'GET',
        headers: headers(),
    })

    const res = await req.json()

    if (res.success) {
        return res.data
    }

    throw new Error(res.message || res.error || 'Failed to fetch objects')
}

export const downloadObject = async (bucketName: string, objectKey: string) => {
    const path = `/${bucketName}/${objectKey}`
    const req = await fetch(endpoint('objects' + path), {
        method: 'GET',
        headers: headers(),
    })

    const res = await req.blob()
    return res
}

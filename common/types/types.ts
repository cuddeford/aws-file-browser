export interface DataBucket {
    name: string
    createdAt: Date
    bucketRegion: string
    type: 'bucket'
}

export interface DataFile {
    name: string
    updatedAt: Date
    size: number
    type: 'object'
}

export interface DataFolder {
    name: string
    type: 'folder'
}

export type FileMode = 'table' | 'icons'

export interface AWSCredentials {
    accessKeyId: string
    secretAccessKey: string
}

export const AWSRegions = {
    'eu-west-1': 'Ireland',
    'eu-west-2': 'London',
    'eu-west-3': 'Paris',
    'eu-central-1': 'Frankfurt',
    'eu-north-1': 'Stockholm',
}

export type AWSRegion = keyof typeof AWSRegions

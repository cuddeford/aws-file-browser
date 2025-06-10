import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFileAudio, faFileVideo, faFileImage, faFile, faBucket } from '@fortawesome/free-solid-svg-icons'

import type { DataBucket, DataFolder, DataFile } from 'types'
import getFileType from '../../lib/getFileType'
import downloadToDisk from '../../lib/downloadToDisk'
import { downloadObject } from '../../lib/api'

type Entities = DataFile | DataFolder | DataBucket

const PreviewImage = (props: {
    bucketName?: string
    name: string
    type: string
    fileInfo: { type: string, extension?: string }
    filename: string
    icon: any
}) => {
    const { bucketName, name, type, fileInfo, filename, icon } = props

    const { data, error, isFetching } = useQuery({
        queryKey: ['object', bucketName, name],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 1500))
            const blob = await downloadObject(bucketName!, name)
            return URL.createObjectURL(blob)
        },
        enabled: !!bucketName && type === 'object' && fileInfo.type === 'image',
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
    })

    const [imageOpacity, setImageOpacity] = useState(0)

    if (fileInfo.type !== 'image' || isFetching || error) {
        return <FontAwesomeIcon icon={icon} size='4x' fixedWidth />
    }

    return <img
        src={data}
        alt={filename}
        className='entity-image'
        onLoad={() => setImageOpacity(1)}
        style={{
            opacity: imageOpacity,
            transition: 'opacity 1000ms ease-in-out',
        }}
    />
}

const EntityIcon = ({ name, type, bucketName }: { name: string, type: string, bucketName?: string }) => {
    const navigate = useNavigate()

    const segments = name.split('/').filter(Boolean)
    const filename = segments[segments.length - 1]

    const fileInfo = type === 'bucket'
        ? { type: 'bucket' }
        : type === 'object'
            ? getFileType(filename)
            : { type: 'folder', extension: '' }

    const icon = {
        bucket: faBucket,
        folder: faFolder,
        audio: faFileAudio,
        video: faFileVideo,
        image: faFileImage,
        document: faFile
    }[fileInfo.type] || faFile

    const linkPath = type === 'bucket'
        ? name
        : `/${bucketName}/${name}`

    const handleClick = async (event: React.MouseEvent) => downloadToDisk({
        bucketName,
        name,
        filename,
        type,
        navigate: () => navigate(linkPath),
        event,
    })

    return (
        <Link
            to={linkPath}
            onClick={handleClick}
            className='icon glass-effect-hover'
        >
            <PreviewImage
                bucketName={bucketName}
                name={name}
                type={type}
                fileInfo={fileInfo}
                filename={filename}
                icon={icon}
            />

            <div
                className='file-name'
                title={filename}
            >
                {filename}
            </div>

            <div className='file-extension'>
                {fileInfo.extension || '\u00A0'}
            </div>
        </Link>
    )
}

const EntityIcons = (props: {
    entities: Entities[]
    bucketName?: string
}) => {
    const { entities, bucketName } = props

    return entities.map(({ name, type }) => <EntityIcon
        key={name}
        name={name}
        type={type}
        bucketName={bucketName}
    />)
}

export default EntityIcons

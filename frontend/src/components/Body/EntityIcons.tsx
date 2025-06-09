import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFileAudio, faFileVideo, faFileImage, faFile, faBucket } from '@fortawesome/free-solid-svg-icons'

import type { DataBucket, DataFolder, DataFile } from 'types'
import getFileType from '../../lib/getFileType'
import downloadToDisk from '../../lib/downloadToDisk'

type Entities = DataFile | DataFolder | DataBucket

const EntityIcons = (props: {
    entities: Entities[]
    bucketName?: string
}) => {
    const { entities, bucketName } = props

    const navigate = useNavigate()

    return entities.map(({ name, type }) => {
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
                key={name}
                to={linkPath}
                onClick={handleClick}
                className='icon glass-effect-hover'
            >
                <FontAwesomeIcon icon={icon} size='4x' fixedWidth />

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
    })
}

export default EntityIcons

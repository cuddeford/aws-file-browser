import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFileAudio, faFileVideo, faFileImage, faFile, faBucket } from '@fortawesome/free-solid-svg-icons'
import prettyBytes from 'pretty-bytes'

import getFileType from '../../lib/getFileType'
import downloadToDisk from '../../lib/downloadToDisk'

const EntityTable = (props: {
    entities: any[]
    isBucket?: boolean
    bucketName?: string
}) => {
    const { entities, isBucket, bucketName } = props

    const navigate = useNavigate()

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: '60%', textAlign: 'left' }}>Name</th>
                    <th style={{ width: '20%', textAlign: 'left' }}>{isBucket ? 'Created' : 'Updated'}</th>
                    <th style={{ width: '10%', textAlign: isBucket ? 'left' : 'right' }}>{isBucket ? 'Region' : 'Size'}</th>
                    {!isBucket && <th style={{ width: '15%', textAlign: 'left' }}>Kind</th>}
                </tr>
            </thead>

            <tbody>
                {entities.map(({ name, size, createdAt, updatedAt, type, bucketRegion }) => {
                    const segments = name.split('/').filter(Boolean)
                    const filename = segments[segments.length - 1]
                    const isFolder = isBucket || name.endsWith('/')
                    const path = isBucket
                        ? name
                        : `/${bucketName}/${name}`

                    const fileInfo = isBucket
                        ? { type: 'bucket' }
                        : isFolder
                            ? { type: 'folder' }
                            : getFileType(filename)

                    const icon = {
                        bucket: faBucket,
                        folder: faFolder,
                        audio: faFileAudio,
                        video: faFileVideo,
                        image: faFileImage,
                        document: faFile
                    }[fileInfo.type] || faFile

                    const sizeReadable = size ? prettyBytes(size) : '-'
                    const date = isBucket
                        ? new Date(createdAt).toLocaleString()
                        : updatedAt ? new Date(updatedAt).toLocaleString() : '-'

                    const handleClick = async (event: React.MouseEvent) => downloadToDisk({
                        bucketName,
                        name,
                        filename,
                        type,
                        navigate: () => navigate(path),
                        event,
                    })

                    // Trick to make the whole table row clickable while preserving the <a> behavior
                    const LinkElement = ({ children }: { children: React.ReactNode }) => (
                        <Link to={path} onClick={handleClick}>
                            {children}
                        </Link>
                    )

                    return (
                        <tr key={name} className='glass-effect-hover'>
                            <td>
                                <LinkElement>
                                    <FontAwesomeIcon icon={icon} fixedWidth /> {filename}
                                </LinkElement>
                            </td>

                            <td>
                                <LinkElement>{date}</LinkElement>
                            </td>

                            {isBucket
                                ? <td style={{ textAlign: 'left' }}>
                                    <LinkElement>{bucketRegion}</LinkElement>
                                </td>
                                : <td style={{ textAlign: 'right' }}>
                                    <LinkElement>{sizeReadable}</LinkElement>
                                </td>}

                            {!isBucket && <td>
                                <LinkElement>{fileInfo.type}</LinkElement>
                            </td>}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default EntityTable

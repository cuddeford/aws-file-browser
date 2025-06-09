import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useBucketPathContext } from '../../context/bucketPathContext'
import { useFileModeContext } from '../../context/fileModeContext'
import { useKeyIdContext } from '../../context/keyIdContext'
import { useRegionContext } from '../../context/regionContext'
import { useSecretKeyContext } from '../../context/secretKeyContext'

import BucketList from './BucketList'
import ObjectList from './ObjectList'
import Info from '../Info'

const Body = () => {
    const { setBucketPath } = useBucketPathContext()
    const { 'bucket-name': bucketName, '*': folders } = useParams()

    useEffect(() => {
        if (!bucketName) {
            setBucketPath('/')
            return
        }

        let label = `/${bucketName}`
        if (folders) {
            label += `/${folders}`
        }

        setBucketPath(label)
    }, [bucketName, folders, setBucketPath])

    const viewMode: 'bucketList' | 'objectList' = bucketName
        ? 'objectList'
        : 'bucketList'
    const { fileMode } = useFileModeContext()

    const { keyId } = useKeyIdContext()
    const { secretKey } = useSecretKeyContext()
    const { region } = useRegionContext()
    const missingCredentials = !keyId || !secretKey || !region

    return (
        <div id='body-container' >
            <div id='body-wrapper' className='glass-effect center'>
                <div id='body-content'>
                    {missingCredentials
                        ? <Info
                            title='Getting started'
                            description='Please set your AWS credentials in the settings.'
                        />
                        : <>
                            <BucketList
                                render={viewMode === 'bucketList'}
                                fileMode={fileMode}
                            />

                            {bucketName && <ObjectList
                                render={viewMode === 'objectList'}
                                fileMode={fileMode}
                                bucketName={bucketName}
                                folders={folders}
                            />}
                        </>}
                </div>
            </div>
        </div>
    )
}

export default Body

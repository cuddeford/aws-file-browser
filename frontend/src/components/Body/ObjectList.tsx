import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useGlobalFetchingContext } from '../../context/globalFetchingContext'
import type { FileMode } from 'types'
import { getObjects } from '../../lib/api'

import QueryState from './QueryState'
import EntityTable from './EntityTable'
import EntityIcons from './EntityIcons'

interface ObjectListProps {
    render: boolean
    fileMode: FileMode
    bucketName: string
    folders?: string
}

const ObjectList = ({ render, fileMode, bucketName, folders }: ObjectListProps) => {
    const { setIsGlobalFetching } = useGlobalFetchingContext()

    const { data, isFetching, isLoading, error, refetch } = useQuery({
        queryKey: ['objects', bucketName, folders],
        enabled: render,
        queryFn: () => getObjects(bucketName, folders || ''),
        retry: false,
    })

    useEffect(() => {
        const handler = () => refetch()
        window.addEventListener('force-refetch', handler)
        return () => window.removeEventListener('force-refetch', handler)
    }, [refetch])

    useEffect(() => {
        setIsGlobalFetching(isFetching)
    }, [isFetching])

    if (!render) {
        return null
    }

    const noFiles = !data?.folders.length && !data?.objects.length

    const combined = [
        ...(data?.folders || []),
        ...(data?.objects || []),
    ]

    return (
        <QueryState
            isFetching={isLoading}
            error={error}
            fallback={noFiles && <h3>No files</h3>}
        >
            {data && (<>
                {fileMode === 'table'
                    ? <EntityTable
                        entities={combined}
                        bucketName={bucketName}
                    />
                    : <EntityIcons
                        entities={combined}
                        bucketName={bucketName}
                    />}
                </>
            )}
        </QueryState>
    )
}

export default ObjectList

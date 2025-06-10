import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import type { DataBucket, FileMode } from 'types'
import { getBuckets } from '../../lib/api'

import { useGlobalFetchingContext } from '../../context/globalFetchingContext'

import { useCustomEventHandler } from '../../hooks'

import QueryState from './QueryState'
import EntityTable from './EntityTable'
import EntityIcons from './EntityIcons'

interface BucketListProps {
    render: boolean
    fileMode: FileMode
}

const BucketList = (props: BucketListProps) => {
    const { render, fileMode } = props

    const { setIsGlobalFetching } = useGlobalFetchingContext()

    const { data, isFetching, isLoading, error, refetch } = useQuery({
        queryKey: ['buckets', window.localStorage.getItem('aws-file-browser-region')],
        enabled: render,
        queryFn: getBuckets,
        retry: false,
    })

    useEffect(() => {
        setIsGlobalFetching(isFetching)
    }, [isFetching])

    useCustomEventHandler('force-refetch', refetch, [refetch])

    if (!render) {
        return null
    }

    const buckets: DataBucket[] = (data?.buckets || [])

    return (
        <QueryState
            isFetching={isLoading}
            error={error}
            fallback={!data?.buckets?.length && <h3>No buckets found</h3>}
        >
            {fileMode === 'table'
                ? <EntityTable entities={buckets} isBucket />
                : <EntityIcons entities={buckets} />}
        </QueryState>
    )
}

export default BucketList

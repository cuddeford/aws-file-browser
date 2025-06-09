import { useEffect } from 'react'

export const usePageTitle = (bucketPath: string) => {
    useEffect(() => {
        const title = bucketPath !== '/' ? bucketPath : `Buckets`
        window.document.title = `S3: ${title}`
    }, [bucketPath])
}

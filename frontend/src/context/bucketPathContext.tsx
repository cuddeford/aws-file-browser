import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { usePageTitle } from '../hooks'

export const defaultBucketPathContext: {
    bucketPath: string
    setBucketPath: (bucketPath: string) => void
} = {
    bucketPath: '',
    setBucketPath: () => {},
}

const BucketPathContext = createContext<typeof defaultBucketPathContext>(defaultBucketPathContext)
export const useBucketPathContext = () => useContext(BucketPathContext)

export const BucketPathProvider = ({ children }: { children: ReactNode }) => {
    const [bucketPath, setBucketPath] = useState(defaultBucketPathContext.bucketPath)
    const value = useMemo(() => ({ bucketPath, setBucketPath }), [bucketPath])

    usePageTitle(bucketPath)

    return <BucketPathContext.Provider value={value}>
        {children}
    </BucketPathContext.Provider>
}

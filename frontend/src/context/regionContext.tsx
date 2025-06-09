import { createContext, useContext, useMemo } from 'react'
import { useLocalStorageState } from '../hooks'

export const defaultRegionContext: {
    region: string
    setRegion: (region: string) => void
} = {
    region: window.localStorage.getItem('aws-file-browser-region') as string | null || 'eu-west-2',
    setRegion: () => {},
}

const RegionContext = createContext<typeof defaultRegionContext>(defaultRegionContext)
export const useRegionContext = () => useContext(RegionContext)

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
    const [region, setRegion] = useLocalStorageState('aws-file-browser-region', defaultRegionContext.region)
    const value = useMemo(() => ({ region, setRegion }), [region])

    return <RegionContext.Provider value={value}>
        {children}
    </RegionContext.Provider>
}

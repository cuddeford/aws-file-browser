import { createContext, useContext, useMemo, useState } from 'react'

export const defaultGlobalFetchingContext: {
    isGlobalFetching: boolean
    setIsGlobalFetching: (isGlobalFetching: boolean) => void
} = {
    isGlobalFetching: false,
    setIsGlobalFetching: () => {},
}

const GlobalFetchingContext = createContext<typeof defaultGlobalFetchingContext>(defaultGlobalFetchingContext)
export const useGlobalFetchingContext = () => useContext(GlobalFetchingContext)

export const FetchingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isGlobalFetching, setIsGlobalFetching] = useState(defaultGlobalFetchingContext.isGlobalFetching)
    const value = useMemo(() => ({ isGlobalFetching, setIsGlobalFetching }), [isGlobalFetching])

    return <GlobalFetchingContext.Provider value={value}>
        {children}
    </GlobalFetchingContext.Provider>
}

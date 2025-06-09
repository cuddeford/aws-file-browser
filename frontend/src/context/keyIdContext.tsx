import { createContext, useContext, useMemo } from 'react'
import { useLocalStorageState } from '../hooks'

export const defaultKeyIdContext: {
    keyId: string
    setKeyId: (keyId: string) => void
} = {
    keyId: window.localStorage.getItem('aws-file-browser-key-id') as string | null || '',
    setKeyId: () => {},
}

const KeyIdContext = createContext<typeof defaultKeyIdContext>(defaultKeyIdContext)
export const useKeyIdContext = () => useContext(KeyIdContext)

export const KeyIdProvider = ({ children }: { children: React.ReactNode }) => {
    const [keyId, setKeyId] = useLocalStorageState('aws-file-browser-key-id', defaultKeyIdContext.keyId)
    const value = useMemo(() => ({ keyId, setKeyId }), [keyId])

    return <KeyIdContext.Provider value={value}>
        {children}
    </KeyIdContext.Provider>
}

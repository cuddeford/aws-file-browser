import { createContext, useContext, useMemo } from 'react'
import { useLocalStorageState } from '../hooks'

export const defaultSecretKeyContext: {
    secretKey: string
    setSecretKey: (secretKey: string) => void
} = {
    secretKey: window.localStorage.getItem('aws-file-browser-secret-key') as string | null || '',
    setSecretKey: () => {},
}

const SecretKeyContext = createContext<typeof defaultSecretKeyContext>(defaultSecretKeyContext)
export const useSecretKeyContext = () => useContext(SecretKeyContext)

export const SecretKeyProvider = ({ children }: { children: React.ReactNode }) => {
    const [secretKey, setSecretKey] = useLocalStorageState('aws-file-browser-secret-key', defaultSecretKeyContext.secretKey)
    const value = useMemo(() => ({ secretKey, setSecretKey }), [secretKey])

    return <SecretKeyContext.Provider value={value}>
        {children}
    </SecretKeyContext.Provider>
}

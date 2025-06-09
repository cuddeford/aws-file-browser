import { createContext, useContext, useMemo, useState } from 'react'

export const defaultKeyModalContext: {
    keyModalOpen: boolean
    setKeyModalOpen: (keyModalOpen: boolean) => void
} = {
    keyModalOpen: false,
    setKeyModalOpen: () => {},
}

const KeyModalContext = createContext<typeof defaultKeyModalContext>(defaultKeyModalContext)
export const useKeyModalContext = () => useContext(KeyModalContext)

export const KeyModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [keyModalOpen, setKeyModalOpen] = useState(defaultKeyModalContext.keyModalOpen)
    const value = useMemo(() => ({ keyModalOpen, setKeyModalOpen }), [keyModalOpen])

    return <KeyModalContext.Provider value={value}>
        {children}
    </KeyModalContext.Provider>
}

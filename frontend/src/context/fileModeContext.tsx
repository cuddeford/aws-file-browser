import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { FileMode } from 'types'
import { useLocalStorageState } from '../hooks'

export const defaultFileModeContext: {
    fileMode: FileMode
    setFileMode: (fileMode: FileMode) => void
} = {
    fileMode: window.localStorage.getItem('aws-file-browser-fileMode') as FileMode | null || 'table',
    setFileMode: () => {},
}

const FileModeContext = createContext<typeof defaultFileModeContext>(defaultFileModeContext)
export const useFileModeContext = () => useContext(FileModeContext)

export const FileModeProvider = ({ children }: { children: ReactNode }) => {
    const [fileMode, setFileMode] = useLocalStorageState('aws-file-browser-fileMode', defaultFileModeContext.fileMode)
    const value = useMemo(() => ({ fileMode, setFileMode }), [fileMode])

    return <FileModeContext.Provider value={value}>
        {children}
    </FileModeContext.Provider>
}

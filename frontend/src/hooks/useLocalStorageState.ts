import { useEffect, useState } from 'react'

export const useLocalStorageState = <T>(key: string, initialValue: T) => {
    const stateArray = useState(window.localStorage.getItem(key) || initialValue)
    const [state] = stateArray

    useEffect(() => {
        window.localStorage.setItem(key, state as string)
    }, [state])

    return stateArray as [T, (value: T) => void]
}

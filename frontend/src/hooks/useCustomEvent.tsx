import { useEffect } from 'react'

export const useEmitCustomEvent = (eventName: string, ...params: any[]) => {
    return () => window.dispatchEvent(new CustomEvent(eventName, { detail: params }))
}

export const useCustomEventHandler = (eventName: string, onEvent: () => void, deps: any[] = []) => {
    useEffect(() => {
        window.addEventListener(eventName, onEvent)
        return () => window.removeEventListener(eventName, onEvent)
    }, [eventName, onEvent, ...deps])
}

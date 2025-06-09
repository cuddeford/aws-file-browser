import { useEffect, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export const useVirtualHistory = () => {
    const location = useLocation()
    const navType = useNavigationType()

    const [stack, setStack] = useState([location.pathname])
    const [index, setIndex] = useState(0)

    useEffect(() => {
        setStack(prev => {
            const path = location.pathname
            if (navType === 'PUSH') {
                const next = [...prev.slice(0, index + 1), path]
                setIndex(next.length - 1)
                return next
            }

            if (navType === 'POP') {
                const i = prev.indexOf(path)
                if (i !== -1) {
                    setIndex(i)
                }
            }

            return prev
        })
    }, [location.pathname, navType])

    return {
        canGoBack: index > 0,
        canGoForward: index < stack.length - 1,
    }
}

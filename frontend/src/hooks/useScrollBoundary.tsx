import { useEffect, useState } from 'react'

export const useScrollBoundary = (distance: number = 0) => {
    const [boundary, setBoundary] = useState(window.pageYOffset >= distance)

    useEffect(() => {
        const scrollHandler = () => setBoundary(window.pageYOffset >= distance)
        window.addEventListener('scroll', scrollHandler)

        return () => window.removeEventListener('scroll', scrollHandler)
    }, [distance])

    return boundary
}

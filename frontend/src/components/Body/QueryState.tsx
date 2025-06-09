import { useEffect, useState } from 'react'

import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Info from '../Info'

const Loading = () => {
    const [opacity, setOpacity] = useState(0)

    useEffect(() => {
        setOpacity(1)
    }, [])

    return (
        <FontAwesomeIcon
            icon={faArrowRotateRight}
            spin
            size='3x'
            style={{
                opacity,
                animationDuration: '1000ms',
                transition: 'opacity 500ms ease-in-out',
            }}
        />
    )
}

const QueryState = (props: {
    isFetching: boolean
    error: unknown
    fallback?: React.ReactNode
    children: React.ReactNode
}) => {
    const { isFetching, error, fallback, children } = props

    if (isFetching) {
        return <Loading />
    }

    if (error) {
        return <Info
            title='Error'
            description={(error as Error).message}
        />
    }

    if (fallback) {
        return fallback
    }

    return children
}

export default QueryState

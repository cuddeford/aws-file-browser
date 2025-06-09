import React, { useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHomeLg } from '@fortawesome/free-solid-svg-icons'

import { useBucketPathContext } from '../../context/bucketPathContext'

const BucketPath = () => {
    const { bucketPath } = useBucketPathContext()

    const segments = bucketPath.split('/').filter(Boolean)
    const [bucketName] = segments

    const navigate = useNavigate()

    const [isEditing, setIsEditing] = React.useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    if (isEditing) {
        const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                const value = e.currentTarget.value.trim()
                const newValue = value.startsWith('/') ? value : `/${value}`

                if (newValue !== bucketPath) {
                    document.startViewTransition(() => navigate(newValue))
                }

                return setIsEditing(false)
            }

            if (e.key === 'Escape') {
                setIsEditing(false)
            }
        }

        return (
            <h3 className='header-breadcrumbs'>
                <input
                    ref={inputRef}
                    className='glass-effect'
                    type='text'
                    defaultValue={bucketPath}
                    autoComplete='off'
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={keyDownHandler}
                />
            </h3>
        )
    }

    if (!bucketName) {
        return (
            <h3
                className='header-breadcrumbs glass-effect-hover'
                onClick={() => setIsEditing(true)}
            >
                <span>
                    <FontAwesomeIcon icon={faHomeLg} fixedWidth />
                    {' Buckets'}
                </span>
            </h3>
        )
    }

    return (
        <h3
            className='header-breadcrumbs glass-effect-hover'
            onClick={() => setIsEditing(true)}
        >
            <Link
                to='/'
                onClick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    document.startViewTransition(() => navigate('/'))
                }}
            >
                <FontAwesomeIcon
                    icon={faHomeLg}
                    fixedWidth
                />
            </Link>

            {segments.map((segment, index) => {
                const thisPath = segments.slice(0, index + 1).join('/')

                if (index === segments.length - 1) {
                    return <React.Fragment key={thisPath}>
                        {'/'}
                        <span>{segment}</span>
                    </React.Fragment>
                }

                return <React.Fragment key={thisPath}>
                    {'/'}
                    <Link
                        to={`/${thisPath}`}
                        onClick={e => {
                            e.stopPropagation()
                            e.preventDefault()
                            document.startViewTransition(() => navigate(`/${thisPath}`))
                        }}
                        style={{ fontWeight: 'normal' }}
                    >
                        {segment}
                    </Link>
                </React.Fragment>
            })}
        </h3>
    )
}

export default BucketPath

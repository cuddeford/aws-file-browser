import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useEmitCustomEvent } from '../../hooks/useCustomEvent'

interface Props {
    keyId: string
    secretKey: string
    region: string
}
const useRedirectOnCredentialChange = (props: Props) => {
    const { keyId, secretKey, region } = props

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [lastCredentials, setLastCredentials] = useState({ keyId, secretKey, region })
    useEffect(() => {
        setLastCredentials({ keyId, secretKey, region })
    }, [keyId, secretKey, region])

    const emitForceRefetch = useEmitCustomEvent('force-refetch')

    useEffect(() => {
        const credentialsChanged = keyId !== lastCredentials.keyId
            || secretKey !== lastCredentials.secretKey
            || region !== lastCredentials.region

        if (credentialsChanged) {
            if (pathname === '/') {
                // Refetch the react-query query
                emitForceRefetch()
            } else {
                // Navigate to root. react-query will refetch the query automatically
                // when navigating like this
                document.startViewTransition(() => navigate('/', { replace: true }))
            }
        }
    }, [keyId, secretKey, region, pathname])
}

export default useRedirectOnCredentialChange

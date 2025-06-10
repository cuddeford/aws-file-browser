import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import { useKeyModalContext } from '../../context/keyModalContext'
import { AWSRegions } from 'types'
import { useKeyIdContext } from '../../context/keyIdContext'
import { useSecretKeyContext } from '../../context/secretKeyContext'
import { useRegionContext } from '../../context/regionContext'

// Hooks specific to KeyModal
import useRedirectOnCredentialChange from './useRedirectOnCredentialChange'
import useDismissModal from './useDismissModal'
import useSetFixedPosition from './useSetFixedPosition'

const KeyModal = () => {
    const { keyModalOpen, setKeyModalOpen } = useKeyModalContext()

    const { keyId, setKeyId } = useKeyIdContext()
    const { secretKey, setSecretKey } = useSecretKeyContext()
    const { region, setRegion } = useRegionContext()

    const [showSecret, setShowSecret] = useState(false)

    useRedirectOnCredentialChange({ keyId, secretKey, region })
    useDismissModal({ keyModalOpen, setKeyModalOpen })
    useSetFixedPosition()

    return (
        <div id='key-modal' className='glass-effect' style={{
            pointerEvents: keyModalOpen ? 'all' : 'none',
            visibility: keyModalOpen ? 'visible' : 'hidden',
            opacity: keyModalOpen ? 1 : 0,
            filter: keyModalOpen ? 'blur(0px)' : 'blur(5px)',
            transform: keyModalOpen ? 'scale(1)' : 'scale(0.9)',
            transition: keyModalOpen ? 'all 150ms ease-in-out' : 'all 250ms ease-in-out',
        }}>
            <div>
                <h4>AWS Credentials</h4>

                <div>accessKeyId</div>
                <input
                    className='glass-effect'
                    type='text'
                    value={keyId}
                    onInput={e => setKeyId(e.currentTarget.value)}
                />

                <br />

                <div style={{ marginTop: 10 }}>
                    secretAccessKey <FontAwesomeIcon
                        icon={showSecret ? faEye : faEyeSlash}
                        fixedWidth
                        onClick={() => setShowSecret(!showSecret)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <input
                    autoComplete='off'
                    className='glass-effect'
                    type='text'
                    value={secretKey}
                    // @ts-ignore
                    style={{ WebkitTextSecurity: showSecret ? 'none' : 'disc' }}
                    onInput={e => setSecretKey(e.currentTarget.value)}
                />

                <br />
                <br />

                <div>Region</div>
                <select
                    className='glass-effect'
                    value={region}
                    onChange={e => {
                        setRegion(e.currentTarget.value)

                        if (keyId && secretKey) {
                            setKeyModalOpen(false)
                        }
                    }}
                >
                    {Object.entries(AWSRegions).map(([key, value]) => (
                        <option key={key} value={key}>
                            {key} ({value})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default KeyModal

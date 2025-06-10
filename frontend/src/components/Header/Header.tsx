import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faArrowRotateRight, faFile, faBars, faKey } from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components'

import { useFileModeContext } from '../../context/fileModeContext'
import { useKeyModalContext } from '../../context/keyModalContext'
import { useGlobalFetchingContext } from '../../context/globalFetchingContext'

import { useScrollBoundary, useVirtualHistory } from '../../hooks'

import BucketPath from './BucketPath'
import { useKeyIdContext } from '../../context/keyIdContext'
import { useRegionContext } from '../../context/regionContext'
import { useSecretKeyContext } from '../../context/secretKeyContext'

const HeaderButton = styled.button.attrs({ className: 'glass-effect' })<{ $enabled?: boolean }>`
    opacity: ${props => props.$enabled ? 1 : 0.5};
`

const Header = () => {
    const { keyModalOpen, setKeyModalOpen } = useKeyModalContext()
    const { fileMode, setFileMode } = useFileModeContext()
    const navigate = useNavigate()
    const scrollAtTop = useScrollBoundary(30)

    const { canGoBack, canGoForward } = useVirtualHistory()
    const { isGlobalFetching } = useGlobalFetchingContext()

    const { keyId } = useKeyIdContext()
    const { secretKey } = useSecretKeyContext()
    const { region } = useRegionContext()
    const missingCredentials = !keyId || !secretKey || !region

    const headerFadeStyle = scrollAtTop ? 'header-fade' : ''

    return (
        <div className={`center glass-effect header ${headerFadeStyle}`}>
            <div id='left-btns'>
                <HeaderButton
                    onClick={() => canGoBack && document.startViewTransition(() => navigate(-1))}
                    $enabled={canGoBack}
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        fixedWidth
                    />
                </HeaderButton>

                <HeaderButton
                    onClick={() => canGoForward && document.startViewTransition(() => navigate(+1))}
                    $enabled={canGoForward}
                >
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        fixedWidth
                    />
                </HeaderButton>

                <HeaderButton
                    onClick={() => {
                        if (!isGlobalFetching) {
                            window.dispatchEvent(new Event('force-refetch'))
                        }
                    }}
                    $enabled={!isGlobalFetching}
                >
                    <FontAwesomeIcon
                        icon={faArrowRotateRight}
                        spin={isGlobalFetching}
                        fixedWidth
                        style={{ animationDuration: '1000ms' }}
                    />
                </HeaderButton>
            </div>

            <BucketPath />

            <div id='right-btns'>
                <HeaderButton
                    className={fileMode === 'icons' ? 'active' : ''}
                    onClick={() => {
                        if (fileMode !== 'icons') {
                            document.startViewTransition(() => setFileMode('icons'))
                        }
                    }}
                    $enabled
                >
                    <FontAwesomeIcon
                        icon={faFile}
                        fixedWidth
                    />
                </HeaderButton>

                <HeaderButton
                    className={fileMode === 'table' ? 'active' : ''}
                    onClick={() => {
                        if (fileMode !== 'table') {
                            document.startViewTransition(() => setFileMode('table'))
                        }
                    }}
                    $enabled
                >
                    <FontAwesomeIcon
                        icon={faBars}
                        fixedWidth
                    />
                </HeaderButton>

                <HeaderButton
                    id='key-modal-btn'
                    className={keyModalOpen ? 'active' : missingCredentials ? 'attention' : ''}
                    style={{ marginLeft: 30 }}
                    onClick={() => setKeyModalOpen(!keyModalOpen)}
                    $enabled
                >
                    <FontAwesomeIcon
                        icon={faKey}
                        fixedWidth
                    />
                </HeaderButton>
            </div>
        </div>
    )
}

export default Header

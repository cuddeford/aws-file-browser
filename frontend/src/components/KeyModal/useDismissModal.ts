import { useEffect } from 'react'

interface Props {
    keyModalOpen: boolean
    setKeyModalOpen: (open: boolean) => void
}

const useDismissModal = (props: Props) => {
    const { keyModalOpen, setKeyModalOpen } = props

    // Dismiss the modal when clicking anywhere on the page except for the key button and the modal itself
    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (!keyModalOpen) {
                return
            }

            const modal = document.getElementById('key-modal')
            if (event.target === modal || modal?.contains(event.target as Node)) {
                return
            }

            const keyModalBtn = document.getElementById('key-modal-btn')
            if (event.target === keyModalBtn || keyModalBtn?.contains(event.target as Node)) {
                return
            }

            setKeyModalOpen(false)
        }

        window.addEventListener('click', handler)

        return () => window.removeEventListener('click', handler)
    }, [keyModalOpen])

    // Dismiss the modal when pressing the Escape key
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && keyModalOpen) {
                setKeyModalOpen(false)
            }
        }

        window.addEventListener('keydown', handler)

        return () => window.removeEventListener('keydown', handler)
    }, [keyModalOpen, setKeyModalOpen])
}

export default useDismissModal

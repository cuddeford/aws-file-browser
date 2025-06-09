import { useEffect } from 'react'

const useSetFixedPosition = () => {
    // Imperatively position the modal based on the key button's fixed position.
    // TODO: use CSS for positioning instead of JavaScript or use refs
    useEffect(() => {
        const handleResize = () => {
            const keyModal = document.getElementById('key-modal')
            const keyModalBtn = document.getElementById('key-modal-btn')

            if (!keyModal || !keyModalBtn) {
                return
            }

            const rect = keyModalBtn.getBoundingClientRect()
            keyModal.style.left = `${rect.x - 295}px`
            keyModal.style.top = `${rect.y + 20}px`
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
}

export default useSetFixedPosition

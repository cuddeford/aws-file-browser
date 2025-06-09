import { downloadObject } from './api'

interface Options {
    event: React.MouseEvent
    navigate: () => void
    bucketName?: string
    name: string
    filename: string
    type: string
}

const downloadToDisk = async (options: Options) => {
    const { event, navigate, bucketName, name, filename, type } = options

    event.preventDefault()

    if (type !== 'object') {
        document.startViewTransition(() => navigate())
        return
    }

    if (!bucketName) {
        return
    }

    const blob = await downloadObject(bucketName, name)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
}

export default downloadToDisk

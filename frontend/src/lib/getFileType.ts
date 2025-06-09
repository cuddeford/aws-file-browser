export type FileType = 'image' | 'audio' | 'video' | 'document'

const getFileType = (filename: string): { extension: string, type: FileType } => {
    const types: Record<Exclude<FileType, 'document'>, string[]> = {
        image: ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif', 'svg', 'webp', 'ico'],
        audio: ['mp3', 'wav', 'flac', 'ogg', 'aac', 'm4a'],
        video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    }

    const extension = filename.split('.').pop()?.toLowerCase()
    if (!extension) {
        return {
            extension: '',
            type: 'document',
        }
    }

    for (const [type, extensions] of Object.entries(types) as [FileType, string[]][]) {
        if (extensions.includes(extension)) {
            return {
                extension,
                type,
            }
        }
    }

    return {
        extension,
        type: 'document',
    }
}

export default getFileType

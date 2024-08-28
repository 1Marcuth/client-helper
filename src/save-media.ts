export type SaveMediaOptions = {
    source: string
    fileName: string
}

export class MediaSaveError extends Error {
    constructor(source: string) {
        super(`Failed to fetch media from ${source}`)
    }
}

async function saveMedia({
    source,
    fileName
}: SaveMediaOptions): Promise<void> {
    const response = await fetch(source)

    if (!response.ok) {
        throw new MediaSaveError(source)
    }

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const $link = document.createElement("a")

    $link.href = blobUrl
    $link.download = fileName
    $link.click()
    $link.remove()

    URL.revokeObjectURL(blobUrl)
}

export default saveMedia
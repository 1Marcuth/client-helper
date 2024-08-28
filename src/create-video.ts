export type CreateVideoOptions = {
    source: string
}

export class VideoLoadError extends Error {
    constructor(source: string, error: Event) {
        super(`Failed to load video at ${source}: ${error}`)
    }
}

function createVideo({ source }: CreateVideoOptions): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
        const video = new HTMLVideoElement()

        video.src = source

        function handleVideoLoad(): void {
            video.removeEventListener("loadeddata", handleVideoLoad)
            video.removeEventListener("error", handleVideoError)
            return resolve(video)
        }

        function handleVideoError(error: Event): void {
            return reject(new VideoLoadError(source, error))
        }

        video.addEventListener("loadeddata", handleVideoLoad)
        video.addEventListener("error", handleVideoError)
    })
}

export default createVideo
export type CreateImageOptions = {
    source: string
}

export class ImageLoadError extends Error {
    constructor(source: string, error: Event | string) {
        super(`Failed to load image at ${source}: ${error}`)
        this.name = "ImageLoadError"
    }
}

function createImage({
    source
}: CreateImageOptions): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        function handleImageLoad(): void {
            return resolve(image)
        }
        
        function handleImageError(error: any): void {
            return reject(
                new ImageLoadError(source, error)
            )
        }

        const image = new Image()

        image.src = source

        image.addEventListener("load", handleImageLoad)
        image.addEventListener("error", handleImageError)
    })
}

export default createImage
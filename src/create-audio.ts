export type CreateAudioOptions = {
    source: string
}

export class AudioLoadError extends Error {
    constructor(source: string, error: ErrorEvent) {
        super(`Failed to load audio at ${source}: ${error}`)
    }
}

function createAudio({ source }: CreateAudioOptions): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
        function handleAudioLoad(): void {
            audio.removeEventListener("loadeddata", handleAudioLoad)
            audio.removeEventListener("error", handleAudioError)
            return resolve(audio)
        }
        
        function handleAudioError(error: any): void {
            return reject(
                new AudioLoadError(source, error)
            )
        }

        const audio = new Audio()

        audio.src = source

        audio.addEventListener("loadeddata", handleAudioLoad)
        audio.addEventListener("error", handleAudioError)
    })
}

export default createAudio
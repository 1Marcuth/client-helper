import fileToDataUrl from "./file-to-data-url"
import createAudio from "./create-audio"
import openFile from "./open-file"

export type OpenAudioOptions = {
    acceptedExtensions?: string[]
    minFileSizeInBytes?: number
    maxFileSizeInBytes?: number
    minDurationInSeconds?: number
    maxDurationInSeconds?: number
    closedWindowCheckDelay?: number
}

export class AudioTooLargeError extends Error {
    constructor(maxSize: number) {
        super(`The selected audio is too large. The maximum size allowed is ${maxSize} bytes.`)
    }
}

export class AudioDurationTooShortError extends Error {
    constructor(minDuration: number) {
        super(`The selected audio's duration is too short. The minimum duration allowed is ${minDuration} seconds.`)
    }
}

export class AudioDurationTooLongError extends Error {
    constructor(maxDuration: number) {
        super(`The selected audio's duration is too long. The maximum duration allowed is ${maxDuration} seconds.`)
    }
}

const defaultOptions = {
    acceptedExtensions: [ "audio/*" ]
}

async function openAudio({
    acceptedExtensions = [ "audio/*" ],
    minFileSizeInBytes,
    maxFileSizeInBytes,
    minDurationInSeconds,
    maxDurationInSeconds,
    closedWindowCheckDelay
}: OpenAudioOptions = defaultOptions): Promise<HTMLAudioElement> {
    const file = await openFile({
        types: acceptedExtensions,
        maxSizeInBytes: maxFileSizeInBytes,
        minSizeInBytes: minFileSizeInBytes,
        closedWindowCheckDelay: closedWindowCheckDelay
    })

    const fileDataUrl = await fileToDataUrl({ file: file })
    const audio = await createAudio({ source: fileDataUrl })

    if (maxFileSizeInBytes && file.size > maxFileSizeInBytes) {
        throw new AudioTooLargeError(maxFileSizeInBytes)
    }

    if (minDurationInSeconds) {
        if (audio.duration < minDurationInSeconds) {
            throw new AudioDurationTooShortError(minDurationInSeconds)
        }
    }

    if (maxDurationInSeconds) {
        if (audio.duration > maxDurationInSeconds) {
            throw new AudioDurationTooLongError(maxDurationInSeconds)
        }
    }

    return audio
}

export default openAudio
import fileToDataUrl from "./file-to-data-url"
import createVideo from "./create-video"
import openFile from "./open-file"

type VideoSize = {
    width: number
    height: number
}

export type OpenVideoOptions = {
    acceptedExtensions?: string[]
    maxSize?: VideoSize
    minSize?: VideoSize
    minFileSizeInBytes?: number
    maxFileSizeInBytes?: number
    closedWindowCheckDelay?: number
    minDurationInSeconds?: number
    maxDurationInSeconds?: number
}

export class VideoTooSmallError extends Error {
    constructor(minSize: VideoSize) {
        super(`The selected video is too small. The minimum size allowed is ${minSize.width}x${minSize.height}.`)
    }
}

export class VideoTooLargeError extends Error {
    constructor(maxSize: VideoSize) {
        super(`The selected video is too large. The maximum size allowed is ${maxSize.width}x${maxSize.height}.`)
    }
}

export class VideoDurationTooShortError extends Error {
    constructor(minDuration: number) {
        super(`The selected video's duration is too short. The minimum duration allowed is ${minDuration} seconds.`)
    }
}

export class VideoDurationTooLongError extends Error {
    constructor(maxDuration: number) {
        super(`The selected video's duration is too long. The maximum duration allowed is ${maxDuration} seconds.`)
    }
}

const defaultOptions = {
    acceptedExtensions: [ "video/*" ]
}

async function openVideo({
    acceptedExtensions = [ "video/*" ],
    maxSize,
    minSize,
    minFileSizeInBytes,
    maxFileSizeInBytes,
    closedWindowCheckDelay,
    minDurationInSeconds,
    maxDurationInSeconds
}: OpenVideoOptions = defaultOptions): Promise<HTMLVideoElement> {
    const file = await openFile({
        types: acceptedExtensions,
        maxSizeInBytes: maxFileSizeInBytes,
        minSizeInBytes: minFileSizeInBytes,
        closedWindowCheckDelay: closedWindowCheckDelay
    })

    const fileDataUrl = await fileToDataUrl({ file: file })
    const video = await createVideo({ source: fileDataUrl })

    if (minSize) {
        if (video.videoWidth < minSize.width || video.videoHeight < minSize.height) {
            throw new VideoTooSmallError(minSize)
        }
    }

    if (maxSize) {
        if (video.videoWidth > maxSize.width || video.videoHeight > maxSize.height) {
            throw new VideoTooLargeError(maxSize)
        }
    }

    if (minDurationInSeconds) {
        if (video.duration < minDurationInSeconds) {
            throw new VideoDurationTooShortError(minDurationInSeconds)
        }
    }

    if (maxDurationInSeconds) {
        if (video.duration > maxDurationInSeconds) {
            throw new VideoDurationTooLongError(maxDurationInSeconds)
        }
    }

    return video
}

export default openVideo
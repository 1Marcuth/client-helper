export type FileToDataUrlOptions = {
    file: File
}

export class TargetNotFoundError extends Error {
    constructor(event: Event) {
        super("Not found target of event: " + JSON.stringify(event))
        this.name = "TargetNotFoundError"
    }
}

export class FileDataNotFoundError extends Error {
    constructor(event: Event) {
        super("Not found data of event: " + JSON.stringify(event))
        this.name = "DataNotFoundError"
    }
}

function fileToDataUrl({ file }: FileToDataUrlOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        function handleFileReaderLoad(event: ProgressEvent<FileReader>) {
            const target = event.target
        
            if (!target) {
                return reject(
                    new TargetNotFoundError(event)
                )
            }
        
            const data = event.target.result
        
            if (!data) {
                return reject(
                    new FileDataNotFoundError(event)
                )
            }
        
            return resolve(data as string)
        }
        
        function handleFileReaderError(event: Event) {
            throw new Error(`FileReaderError: ${event}`)
        }

        const reader = new FileReader()

        reader.addEventListener("load", handleFileReaderLoad)
        reader.addEventListener("error", handleFileReaderError)

        reader.readAsDataURL(file)
    })
}

export default fileToDataUrl
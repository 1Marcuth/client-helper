export type FormatFileSizeOptions = {
    fileSizeInBytes: number
    decimalPlaces?: number
    units?: ("Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB")[]
}

function formatFileSize({
    fileSizeInBytes,
    decimalPlaces = 2,
    units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB"]
}: FormatFileSizeOptions): string {
    const kb = 1024
    const mb = kb * 1024
    const gb = mb * 1024
    const tb = gb * 1024
    const pb = tb * 1024
    const eb = pb * 1024

    let unitIndex = 0
    let size = fileSizeInBytes

    while (size >= kb && unitIndex < units.length - 1) {
        size /= kb
        unitIndex++
    }

    return size.toFixed(decimalPlaces) + " " + units[unitIndex]
}

export default formatFileSize
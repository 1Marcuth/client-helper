export type IncludeCssOptions = {
    source: string
}

async function includeCss({ source }: IncludeCssOptions): Promise<void> {
    const request = await fetch(source)
    const stylesString = await request.text()
    const $style = document.createElement("style")
    $style.innerHTML = stylesString
    document.head.appendChild($style)
}

export default includeCss
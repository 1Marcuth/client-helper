export type IncludeScriptOptions = {
    source: string
}

async function includeScript({ source }: IncludeScriptOptions): Promise<void> {
    const request = await fetch(source)
    const scriptSting = await request.text()
    eval(scriptSting)
} 

export default includeScript
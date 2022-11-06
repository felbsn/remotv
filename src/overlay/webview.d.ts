
type events = "did-finish-load" | "dom-ready" | "did-start-loading" | "did-stop-loading" | 'did-frame-finish-load'

declare const webview: {
    loadURL: (url: string) => void,
    executeJavaScript(code: string, userGesture: boolean),
    reload(),
    addEventListener(e: events, f: (ev: any) => void);
    removeEventLisneter(e: events);
}  
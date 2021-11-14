
const NAMESPACE = "MSQrScanner__";

export function saveValue(key: string, value: any) {
    localStorage.setItem(NAMESPACE+key,JSON.stringify(value))
}

export function getValue(key: string): any {
    if (typeof localStorage!=="undefined"){
        let value = localStorage.getItem(NAMESPACE+key)
        if (typeof value!=="undefined") {
            return JSON.parse(value);
        }
    }
}
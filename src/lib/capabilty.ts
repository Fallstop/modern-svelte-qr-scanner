import { browser } from "$app/env";

export async function testCapabilities(): Promise<Error> {
    if (!browser) {
        return null;
    }

    try {
        // Only chrome and old firefox support this
        //@ts-ignore
        let cameraPermState: string = (await navigator?.permissions?.query({ name: "camera" }))?.state
        if (cameraPermState === "denied") {
            console.log("Camera Permission denied")
            return new Error("Camera Permission denied")
        }
    } catch(e) {}
    
    return null
}

export async function testNativeBarcodeReader() {
    if (!browser) {
        return null;
    }
    
    if ("BarcodeDetector" in window) {
        const supportedFormats = await BarcodeDetector.getSupportedFormats();
        return supportedFormats.includes("qr_code")
    }
    return false
}
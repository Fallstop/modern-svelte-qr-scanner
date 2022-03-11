// Possible Workers
import jsqr_qrScannerWebWorker from '$lib/jsqrWebWorker/qrScannerWebWorker?worker';
import native_qrScannerWebWorker from '$lib/nativeWebWorker/qrScannerWebWorker?worker';

import type { DataInput } from "$lib/jsqrWebWorker/qrScannerWebWorker";
import { testNativeBarcodeReader } from '$lib/capabilty';
import { writable } from 'svelte/store';
import type {Writable } from 'svelte/store';

import { browser } from '$app/env';
let worker: Worker | null = null;

export let barcodeEngine: Writable<"jsqr" | "native" | null> = writable(null);

testNativeBarcodeReader().then((nativeBarcodeReaderSupported)=>{
    if (!browser) {
        return;
    }

    if (nativeBarcodeReaderSupported) {
        worker = new native_qrScannerWebWorker();
        console.log("Scanning with native barcode reader");
        barcodeEngine.set("native");
    } else {
        worker = new jsqr_qrScannerWebWorker();
        console.log("Scanning with jsQR Barcode Reader");
        barcodeEngine.set("jsqr");
    }
})

export async function scanData(data: Uint8ClampedArray, width: number, height: number): Promise<ScanResult> {
    let promise = new Promise<ScanResult>((resolve, reject) => {
        if (worker) {
            worker.onmessage = (e) => {
                resolve({ result: e.data, error: null});
            }
            worker.postMessage({data, width, height} as DataInput);
        } else {
            // Worker Not Ready Yet
            setTimeout(()=>{resolve({ result: null, error: null});}, 50)
        }
        
    })

    return await promise
}

export interface ScanResult {
    result: string | null,
    error: string | null
}
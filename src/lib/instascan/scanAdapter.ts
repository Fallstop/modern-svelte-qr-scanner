

import qrScannerWebWorker from '../webWorker/qrScannerWebWorker?worker';
import type { DataInput } from "$lib/webWorker/qrScannerWebWorker";
const worker = new qrScannerWebWorker()

export async function scanData(data: Uint8ClampedArray, width: number, height: number): Promise<ScanResult> {
    let promise = new Promise<ScanResult>((resolve, reject) => {
        worker.onmessage = (e) => {
            resolve({ result: e.data, error: null});
        }
        worker.postMessage({data, width, height} as DataInput);
    })

    return await promise
}

export interface ScanResult {
    result: string | null,
    error: string | null
}
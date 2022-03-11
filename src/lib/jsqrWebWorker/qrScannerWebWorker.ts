import jsQR from 'jsqr';
 
self.addEventListener("message", e => {
    const {data, width, height} = e.data as DataInput;

    var result = jsQR(data, width, height);

    self.postMessage(result?.data || null);
});

export interface DataInput {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}
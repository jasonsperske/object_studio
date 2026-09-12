/** Pack the exporter's self-contained glTF into GLB. Using the same image
 * serialization for both formats avoids canvas.toBlob callbacks that can be
 * indefinitely deferred in embedded/background browsers. */
export function packGlb(input: object): ArrayBuffer {
    const json = JSON.parse(JSON.stringify(input)) as {
        buffers?: {
            uri?: string;
            byteLength: number;
        }[];
        bufferViews?: {
            buffer: number;
            byteOffset?: number;
            byteLength: number;
        }[];
        images?: {
            uri?: string;
            mimeType?: string;
            bufferView?: number;
        }[];
    };
    const decode = (uri: string) => {
        const match = /^data:([^;,]+);base64,(.*)$/s.exec(uri);
        if (!match)
            throw new Error('GLB requires embedded base64 resources.');
        return { mimeType: match[1], bytes: Uint8Array.from(atob(match[2]), c => c.charCodeAt(0)) };
    };
    const chunks: Uint8Array[] = [];
    let length = 0;
    const append = (bytes: Uint8Array) => {
        const offset = length;
        const padded = new Uint8Array(Math.ceil(bytes.byteLength / 4) * 4);
        padded.set(bytes);
        chunks.push(padded);
        length += padded.byteLength;
        return offset;
    };
    if ((json.buffers?.length ?? 0) > 1)
        throw new Error('Expected one embedded geometry buffer.');
    if (json.buffers?.[0]?.uri)
        append(decode(json.buffers[0].uri).bytes);
    for (const image of json.images ?? []) {
        if (!image.uri)
            continue;
        const { bytes, mimeType } = decode(image.uri);
        const byteOffset = append(bytes);
        json.bufferViews ??= [];
        image.bufferView = json.bufferViews.length;
        json.bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.byteLength });
        image.mimeType = mimeType;
        delete image.uri;
    }
    if (length)
        json.buffers = [{ byteLength: length }];
    const text = new TextEncoder().encode(JSON.stringify(json));
    const jsonLength = Math.ceil(text.byteLength / 4) * 4;
    const output = new ArrayBuffer(12 + 8 + jsonLength + (length ? 8 + length : 0));
    const header = new DataView(output), bytes = new Uint8Array(output);
    header.setUint32(0, 0x46546c67, true);
    header.setUint32(4, 2, true);
    header.setUint32(8, output.byteLength, true);
    header.setUint32(12, jsonLength, true);
    header.setUint32(16, 0x4e4f534a, true);
    bytes.fill(32, 20, 20 + jsonLength);
    bytes.set(text, 20);
    if (length) {
        let offset = 20 + jsonLength;
        header.setUint32(offset, length, true);
        header.setUint32(offset + 4, 0x004e4942, true);
        offset += 8;
        for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.byteLength;
        }
    }
    return output;
}

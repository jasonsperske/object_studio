import { useEffect, useState } from 'react';
import type { Part } from '../types';
import { disposeLodParts, reduceDetail, type LodOptions, type LodResult } from '../lib/lod';
export function useLod(source: Part[], options: LodOptions) {
    const [result, setResult] = useState<{
        source: Part[];
        options: LodOptions;
        value: LodResult;
        error?: string;
    } | null>(null);
    useEffect(() => {
        if (options.detail === 100) {
            setResult(null);
            return;
        }
        const controller = new AbortController();
        let owned: Part[] = [];
        // Coalesce slider events, then yield between parts during reduction.
        const timer = setTimeout(() => {
            reduceDetail(source, options, controller.signal).then(value => {
                if (controller.signal.aborted) {
                    disposeLodParts(value.parts, source);
                    return;
                }
                owned = value.parts;
                setResult({ source, options, value });
            }).catch(err => {
                if (!controller.signal.aborted)
                    setResult({ source, options, value: { parts: source, meshParts: source, bakedParts: 0, textureBytes: 0 }, error: err instanceof Error ? err.message : String(err) });
            });
        }, 120);
        return () => { clearTimeout(timer); controller.abort(); disposeLodParts(owned, source); };
    }, [source, options]);
    const current = result?.source === source && result.options === options;
    if (options.detail === 100)
        return { parts: source, meshParts: source, bakedParts: 0, textureBytes: 0, busy: false, error: undefined };
    return { ...(current ? result!.value : { parts: source, meshParts: source, bakedParts: 0, textureBytes: 0 }), busy: !current, error: current ? result?.error : undefined };
}

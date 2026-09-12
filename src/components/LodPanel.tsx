import { DEFAULT_LOD, type LodOptions } from '../lib/lod';
interface Props {
    options: LodOptions;
    onChange: (options: LodOptions) => void;
    originalTriangles: number;
    triangles: number;
    bakedParts: number;
    textureBytes: number;
    eligibleParts: number;
    busy: boolean;
    error?: string;
}
export default function LodPanel({ options, onChange, originalTriangles, triangles, bakedParts, textureBytes, eligibleParts, busy, error }: Props) {
    const change = (patch: Partial<LodOptions>) => onChange({ ...options, ...patch });
    const saved = originalTriangles ? Math.round((1 - triangles / originalTriangles) * 100) : 0;
    return <div className="lod-panel">
    <p className="definition-description">Reduce geometry for lighter models. Full detail uses the object exactly as generated.</p>
    <label className="field"><span className="field-label">Level of detail <strong>{options.detail}%</strong></span>
      <input aria-label="Level of detail" type="range" min="0" max="100" step="5" value={options.detail} onChange={e => change({ detail: Number(e.target.value) })}/>
      <span className="lod-endpoints"><span>Coarse</span><span>Full detail</span></span>
    </label>
    <div className="lod-stats" role="status" aria-live="polite">
      <strong>{busy ? 'Updating…' : triangles.toLocaleString() + ' triangles'}</strong>
      <span>{originalTriangles.toLocaleString()} original{!busy && saved > 0 ? ' · ' + saved + '% fewer' : ''}</span>
      {options.detail === 100 && <span>Original geometry · no reduction or texture baking</span>}
      {!busy && options.detail < 100 && saved === 0 && <span>No safe reduction at these settings. Try a lower detail or higher tolerance.</span>}
    </div>
    <label className="field"><span className="field-label">Reduction strategy</span>
      <select value={options.strategy} onChange={e => change({ strategy: e.target.value as LodOptions['strategy'] })}>
        <option value="geometry">Geometry only</option><option value="textures">Geometry + surface textures</option>
      </select>
      <span className="param-help">{options.strategy === 'geometry' ? 'Simplify meshes while keeping marked lettering as geometry. Suitable for mesh-only exports.' : 'Replace marked flat lettering with transparent texture planes, then simplify the remaining meshes. Use glTF or GLB to retain textures.'}</span>
    </label>
    <label className="field"><span className="field-label">Shape tolerance <strong>{options.tolerance.toFixed(1)}%</strong></span>
      <input aria-label="Shape tolerance" type="range" min="0.1" max="3" step="0.1" value={options.tolerance} onChange={e => change({ tolerance: Number(e.target.value) })}/>
      <span className="param-help">Maximum clustering scale relative to each part’s size, reached at 0% detail. Larger values reduce more geometry but can alter contours. The detail percentage is not a triangle-count target.</span>
    </label>
    <label className="lod-checkbox"><input type="checkbox" checked={options.preserveEdges} onChange={e => change({ preserveEdges: e.target.checked })}/>Preserve original surface shading</label>
    <p className="param-help">Keep hard and smooth shading from the source. Uncheck for a faceted finish. Open boundaries and disconnected pieces are protected in either mode.</p>
    {options.strategy === 'textures' && <>
      <label className="field"><span className="field-label">Texture resolution</span>
        <select value={options.textureSize} onChange={e => change({ textureSize: Number(e.target.value) })}>{[256, 512, 1024, 2048].map(n => <option key={n} value={n}>{n} px</option>)}</select>
        <span className="param-help">Longest edge per surface layer. Higher resolutions keep small text sharper at the cost of texture memory.</span>
      </label>
      <p className="param-help">{eligibleParts ? `${bakedParts} of ${eligibleParts} marked parts baked · approximately ${(textureBytes / 1048576).toFixed(1)} MiB of RGBA textures including mipmaps.` : 'This object has no marked surface details; geometry reduction still applies.'} Raised relief stays as geometry; flat labels need no displacement map.</p>
    </>}
    {error && <p className="error" role="alert">Reduction failed: {error} Showing original geometry.</p>}
    <button className="ghost full" type="button" onClick={() => onChange({ ...DEFAULT_LOD })}>Restore full detail</button>
  </div>;
}

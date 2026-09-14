import type { MediaSurface } from '../types'

export default function MediaPanel({ surfaces, assigned, onAssign, onClear, notify }: {
  surfaces: MediaSurface[]; assigned: string[]; notify: (message: string) => void
  onAssign: (id: string, file: File) => void; onClear: (id: string) => void
}) {
  if (!surfaces.length) return null
  return <section className="media-panel" aria-label="Model textures">
    <h3>Images & screens</h3>
    <p>Drop a file on the model or choose a surface below. Files stay in this session; share links contain only geometry settings.</p>
    {surfaces.map(surface => <div key={surface.id} className="media-slot"
      onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); const files = e.dataTransfer.files; if (files.length === 1) onAssign(surface.id, files[0]); else notify('Drop one file at a time onto its surface.') }}>
      <label>{surface.label}<input type="file" aria-label={`Texture for ${surface.label}`}
        accept={surface.accept === 'image' ? 'image/*' : 'image/*,video/*'}
        onChange={e => { const file = e.target.files?.[0]; if (file) onAssign(surface.id, file); e.target.value = '' }} /></label>
      {assigned.includes(surface.id) && <button type="button" onClick={() => onClear(surface.id)}>Clear</button>}
    </div>)}
  </section>
}

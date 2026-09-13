// Famicom cartridge. Dimensions are approximate visual references in millimetres.
// +Y up, front +Z. Media slots are returned on parts, never in parameters.
export const meta = {
  "name": "Famicom cartridge",
  "description": "Blank-label famicom cartridge with a boxed copy, separate shell halves, PCB and family-specific moulding.",
  "order": 32
}
const profile = {"family": "famicom", "width": 108, "height": 70, "depth": 17, "color": 12367527, "pins": 30, "screws": 2, "box": [115, 150, 25]}
export const params = [
  {
    "id": "presentation",
    "label": "Presentation",
    "type": "select",
    "default": "cart",
    "group": "Model",
    "options": [
      {
        "value": "cart",
        "label": "Cartridge only"
      },
      {
        "value": "boxed",
        "label": "Cartridge with box"
      },
      {
        "value": "open",
        "label": "Open cartridge \u2022 exploded shells"
      }
    ]
  },
  {
    "id": "finish",
    "label": "Shell colour",
    "type": "select",
    "default": "original",
    "group": "Shell",
    "options": [
      {
        "value": "original",
        "label": "Original"
      },
      {
        "value": "grey",
        "label": "Grey"
      },
      {
        "value": "gold",
        "label": "Gold"
      },
      {
        "value": "black",
        "label": "Black"
      },
      {
        "value": "yellow",
        "label": "Yellow"
      }
    ]
  },
  {
    "id": "openGap",
    "label": "Shell separation",
    "type": "number",
    "min": 20,
    "max": 90,
    "step": 1,
    "default": 35,
    "unit": "mm",
    "group": "Model",
    "visibleWhen": (p) => str(p, 'presentation') === 'open'
  },
  {
    "id": "battery",
    "label": "Save battery",
    "type": "boolean",
    "default": false,
    "group": "Board",
    "visibleWhen": (p) => str(p, 'presentation') === 'open'
  }
]
export function build(p) { return buildCartridge(p, profile) }
export function metrics(p) { return [
  { label: 'Family', value: meta.name },
  { label: 'Scale', value: 'Approximate reference dimensions', note: 'Visual scene asset; internal board components are representative, not a repair or manufacturing drawing.' },
  { label: 'Media', value: 'Images only', note: 'Front, rear and packaging faces have independent runtime texture slots.' },
] }
export const presets = [
  {
    "name": "Cartridge only",
    "params": {
      "presentation": "cart"
    }
  },
  {
    "name": "Boxed copy",
    "params": {
      "presentation": "boxed"
    }
  },
  {
    "name": "Opened cartridge",
    "params": {
      "presentation": "open"
    }
  }
]

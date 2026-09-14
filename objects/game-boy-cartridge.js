// Game Boy / Color cartridge. Dimensions are approximate visual references in millimetres.
// +Y up, front +Z. Media slots are returned on parts, never in parameters.
export const meta = {
  "name": "Game Boy / Color cartridge",
  "description": "Game Boy cartridge with a recessed label, upper oval badge, fine grip ribs, insertion arrow and inset rear screw; boxed, open and Color-shell variations.",
  "order": 36
}
const profile = {"family": "gameboy", "width": 57, "height": 65, "depth": 8, "color": 11053477, "pins": 16, "screws": 1, "box": [90, 125, 23]}
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
        "value": "box",
        "label": "Box only"
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
    "visibleWhen": (p) => str(p, 'presentation') !== 'box',
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
    "id": "variant",
    "visibleWhen": (p) => str(p, 'presentation') !== 'box',
    "label": "Shell variant",
    "type": "select",
    "default": "standard",
    "group": "Shell",
    "options": [
      {
        "value": "standard",
        "label": "Original Game Boy"
      },
      {
        "value": "color",
        "label": "Game Boy Color shell"
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
  { "name": "Box only", "params": { "presentation": "box" } },
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
  },
  {
    "name": "Game Boy Color shell",
    "params": {
      "variant": "color"
    }
  }
]

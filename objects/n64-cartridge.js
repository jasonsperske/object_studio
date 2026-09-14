// Nintendo 64 cartridge. Dimensions are approximate visual references in millimetres.
// +Y up, front +Z. Media slots are returned on parts, never in parameters.
export const meta = {
  "name": "Nintendo 64 cartridge",
  "description": "Nintendo 64 cartridge with a bowed top, rounded side cheeks, curved label recess and lower corner details; boxed and open variations with regional key slots.",
  "order": 38
}
const profile = {"family": "n64", "width": 116, "height": 76, "depth": 19, "color": 11053477, "pins": 25, "screws": 2, "box": [178, 125, 30]}
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
    "id": "variant",
    "label": "Shell variant",
    "type": "select",
    "default": "standard",
    "group": "Shell",
    "options": [
      {
        "value": "standard",
        "label": "North American rear keys"
      },
      {
        "value": "japan",
        "label": "Japanese rear keys"
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
  },
  {
    "name": "Japanese rear keys",
    "params": {
      "variant": "japan"
    }
  }
]

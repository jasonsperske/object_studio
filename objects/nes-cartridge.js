// NES cartridge. Dimensions are approximate visual references in millimetres.
// +Y up, front +Z. Media slots are returned on parts, never in parameters.
export const meta = {
  "name": "NES cartridge",
  "description": "Blank-label nes cartridge with a boxed copy, separate shell halves, PCB and family-specific moulding.",
  "order": 31
}
const profile = {"family": "nes", "width": 120, "height": 133, "depth": 17, "color": 11053477, "pins": 36, "screws": 3, "box": [128, 179, 25]}
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
        "label": "Retail shell"
      },
      {
        "value": "nwc1990",
        "label": "NWC 1990 \u2022 DIP switch opening"
      }
    ]
  },
  {
    "id": "screws",
    "label": "Shell revision",
    "type": "select",
    "default": "3",
    "group": "Shell",
    "options": [
      {
        "value": "3",
        "label": "3 screws \u2022 top latches"
      },
      {
        "value": "5",
        "label": "5 screws \u2022 early shell"
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
    "name": "Gold five-screw",
    "params": {
      "finish": "gold",
      "screws": "5"
    }
  },
  {
    "name": "NWC 1990 grey",
    "params": {
      "variant": "nwc1990",
      "finish": "grey",
      "screws": "3"
    }
  },
  {
    "name": "NWC 1990 gold",
    "params": {
      "variant": "nwc1990",
      "finish": "gold",
      "screws": "3"
    }
  }
]

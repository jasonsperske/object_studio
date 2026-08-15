/**
 * Settings glyph: an eight-toothed gear with a bored centre. Drawn as one
 * even-odd path so it fills with the button's current colour.
 */
const GEAR =
  'M13.38 6.86L15.33 6.97L15.33 9.03L13.38 9.14L12.61 11L13.91 12.45L12.45 13.91L11 12.61' +
  'L9.14 13.38L9.03 15.33L6.97 15.33L6.86 13.38L5 12.61L3.55 13.91L2.09 12.45L3.39 11' +
  'L2.62 9.14L0.67 9.03L0.67 6.97L2.62 6.86L3.39 5L2.09 3.55L3.55 2.09L5 3.39L6.86 2.62' +
  'L6.97 0.67L9.03 0.67L9.14 2.62L11 3.39L12.45 2.09L13.91 3.55L12.61 5Z' +
  'M5.6 8a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0Z'

export default function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false">
      <path d={GEAR} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

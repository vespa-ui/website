import type { EuiThemeModifications } from '@elastic/eui';

/**
 * Brand palette: #61D790 (green) / #020202 (ink).
 *
 * EUI's Borealis theme hardcodes each semantic color slot (fill, text, tint,
 * border) to a fixed step of its own blue ramp rather than deriving them from
 * `colors.primary`, so getting brand green throughout buttons/links/selection
 * states requires overriding every slot explicitly. The "*Text"/"link"/
 * "backgroundFilledPrimary" shades below are darkened, WCAG AA-safe (>=4.5:1
 * against white) variants of #61D790 — the raw brand color fails text
 * contrast, so it's reserved for tints, borders and non-text accents.
 */
export const brand = {
  green: '#61D790',
  ink: '#020202',
};

export const euiThemeModifications: EuiThemeModifications = {
  colors: {
    // True-black base shared by both modes for a consistent brand "ink".
    plainDark: '#020202',
    LIGHT: {
      primary: '#218248',
      primaryText: '#1d723f',
      textPrimary: '#1d723f',
      link: '#1d723f',
      highlight: '#e7f9ee',
      backgroundBasePrimary: '#e7f9ee',
      backgroundLightPrimary: '#d6f5e2',
      backgroundFilledPrimary: '#218248',
      backgroundBaseInteractiveSelect: '#e7f9ee',
      backgroundBaseInteractiveSelectHover: '#d6f5e2',
      borderBasePrimary: '#a5e8c0',
      borderStrongPrimary: '#218248',
    },
    DARK: {
      primary: '#5cd68d',
      primaryText: '#5cd68d',
      textPrimary: '#5cd68d',
      link: '#5cd68d',
      highlight: '#0f2417',
      backgroundBasePrimary: '#0c1d13',
      backgroundLightPrimary: '#0f2417',
      backgroundFilledPrimary: '#5cd68d',
      backgroundBaseInteractiveSelect: '#0f2417',
      backgroundBaseInteractiveSelectHover: '#122b1c',
      borderBasePrimary: '#122b1c',
      borderStrongPrimary: '#5cd68d',
    },
  },
};

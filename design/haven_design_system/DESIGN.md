---
name: Haven Design System
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#424843'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#727973'
  outline-variant: '#c2c8c1'
  surface-tint: '#476553'
  primary: '#476553'
  on-primary: '#ffffff'
  primary-container: '#7a9a86'
  on-primary-container: '#133122'
  inverse-primary: '#adceb9'
  secondary: '#4b6173'
  on-secondary: '#ffffff'
  secondary-container: '#cce2f8'
  on-secondary-container: '#506577'
  tertiary: '#8a4f38'
  on-tertiary: '#ffffff'
  tertiary-container: '#c78168'
  on-tertiary-container: '#4c1d0b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8ebd4'
  primary-fixed-dim: '#adceb9'
  on-primary-fixed: '#022113'
  on-primary-fixed-variant: '#2f4d3c'
  secondary-fixed: '#cfe5fb'
  secondary-fixed-dim: '#b3c9de'
  on-secondary-fixed: '#051d2d'
  on-secondary-fixed-variant: '#34495a'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#370e01'
  on-tertiary-fixed-variant: '#6e3823'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is anchored in the concept of "Digital Sanctuary." It prioritizes psychological safety and cognitive ease through a **Minimalist** and **Atmospheric** aesthetic. The interface is designed to feel like a deep breath—uncluttered, intentional, and quiet. 

The style utilizes generous whitespace to reduce choice paralysis and cognitive load. It avoids harsh lines and rigid containers in favor of organic spatial relationships and soft, diffused depth. Visual elements are reduced to their essential forms, using abstract geometric iconography to convey complex emotions without the literalness that can sometimes trigger anxiety.

## Colors

The palette is derived from natural, desaturated tones to evoke a sense of groundedness. 

- **Primary (Sage Green):** Used for growth, progress, and primary actions. It represents healing and the natural world.
- **Secondary (Dusty Blue):** Reserved for stability, meditation, and calm-state indicators.
- **Tertiary (Muted Terracotta):** A soft "Stress Accent." Used sparingly for high-intensity emotions or urgent notifications to ensure they remain visible without becoming alarming.
- **Neutral (Warm Sand / Charcoal Olive):** The primary canvas. The light mode uses a warm, off-white base to avoid the sterile "hospital" feel of pure white, while the dark mode utilizes a deep slate to maintain legibility without high-contrast strain.

## Typography

This design system utilizes **Inter** across all levels to maintain a systematic and highly legible experience. 

- **Headlines:** Use tighter letter spacing and medium-to-semibold weights to provide clear hierarchy and a "premium" editorial feel.
- **Body Text:** Designed with generous line heights (1.5x - 1.6x) to ensure long-form reflections or guided exercises are easy to read.
- **Labels:** Small caps or increased tracking are used for secondary metadata to distinguish functional elements from narrative content.

## Layout & Spacing

The layout philosophy is **Mobile-First** and **Fluid**, emphasizing vertical flow and generous "breathing room."

- **Grid:** A 4-column fluid grid for mobile and an 8-column centered grid for tablet/desktop. 
- **Margins:** A standard 24px side margin ensures content does not feel crowded against the edge of the device.
- **Rhythm:** An 8pt linear scale governs all spacing. Vertical "stacks" use large increments (48px+) to separate distinct sections, reinforcing the minimalist goal of one primary focus per screen.

## Elevation & Depth

This design system eschews traditional borders and heavy shadows in favor of **Tonal Elevation** and **Ambient Depth**.

- **Surface Layers:** Hierarchy is primarily communicated through subtle shifts in background color. For example, a card may be a slightly lighter or cooler tint of the base "Warm Sand."
- **Soft Shadows:** When depth is required, shadows must be extremely diffused (Blur: 20-40px) with very low opacity (5-8%). The shadow color should be tinted with the background hue (e.g., a warm umber shadow rather than pure black) to maintain the organic feel.
- **Glassmorphism:** Used sparingly for fixed navigation bars or overlays to maintain context of the underlying "sanctuary" space. Use a high backdrop-blur (20px+) and a subtle inner glow.

## Shapes

The shape language is defined by **Softened Geometry.**

- **Corner Radii:** Standard elements use a 0.5rem (8px) radius. Larger containers, such as modal sheets or cards, use a 1.5rem (24px) radius to feel more approachable and less "technical."
- **Icons:** Abstract and geometric. Avoid sharp points; all icon terminals and corners should be slightly rounded to match the UI components.

## Components

### Buttons
- **Primary:** Filled with Sage Green, white text, no border. Large padding (16px vertical) and highly rounded corners.
- **Ghost:** No background or border. Uses Sage Green text with a weight of 600. Focus is indicated by a subtle background tint change rather than an outline.

### Cards
- **Style:** Borderless with a very soft ambient shadow or a 10% opacity fill of the primary color. Used to group mood entries, journal prompts, or meditation sessions.

### Input Fields
- **Style:** Understated. A soft-filled background (Warm Sand + 5% darkness) with no border. The label sits above the field in a `label-sm` style. The focus state is indicated by a subtle 2px bottom-bar in Sage Green.

### Chips & Tags
- **Style:** Pill-shaped (rounded-xl) with low-contrast backgrounds. Used for mood selection or topic filtering.

### Progress Indicators
- **Style:** Thick, rounded bars with a soft Sage-to-Blue gradient. Avoid "percentage" numbers where possible, using descriptive "progress" language to reduce performance anxiety.
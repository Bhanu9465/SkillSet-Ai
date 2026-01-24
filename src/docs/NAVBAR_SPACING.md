# Navbar Spacing Standards

## Overview
To ensure consistent spacing across the application, we've standardized the navbar height and padding approach. This document outlines the correct way to handle spacing in relation to the fixed navbar.

## CSS Variable
We've defined a CSS variable for the navbar height in `src/App.css`:

```css
:root {
  --navbar-height: 70px;
}
```

## Usage Guidelines

### For New Pages
When creating new page components, use one of these approaches:

1. **Preferred: Use the Utility Class**
   ```css
   .your-page-container {
     @extend .page-container; /* If using SCSS */
     /* or */
     padding-top: var(--navbar-height);
   }
   ```

2. **For Media Queries**
   ```css
   @media (max-width: 768px) {
     .your-page-container {
       padding-top: var(--navbar-height);
     }
   }
   ```

3. **For Notched Devices (iPhone, etc.)**
   ```css
   @supports (padding-top: env(safe-area-inset-top)) {
     .your-page-container {
       padding-top: calc(var(--navbar-height) + env(safe-area-inset-top));
     }
   }
   ```

### Common Issues to Avoid
- Hardcoded pixel values for `padding-top` that don't match the navbar height
- Inconsistent spacing in different media queries
- Missing `padding-top` which can cause content to be hidden behind the navbar

By following these guidelines, we ensure a consistent user experience across all pages and devices. 
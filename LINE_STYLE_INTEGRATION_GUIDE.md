# Line Style Integration Guide

This document provides a comprehensive guide for integrating the line style fixes into the MapMyRoots family tree application.

## Problem Summary

The line style system had three main issues:
1. **Export Issue**: Line styles were not applied to exported files (PNG, JPEG, PDF, SVG)
2. **Persistence Issue**: Line style settings were not saved in JSON files
3. **UI Integration Issue**: Line style controls were not connected to functionality

## Files Modified/Created

### 1. Fixed Files
- **`canvas-renderer.js`**: Fixed `drawConnectionsOnly()` method to use actual settings instead of hardcoded values
- **`exporter.js`**: Updated SVG export to generate dynamic CSS for all line styles
- **`core-export.js`**: Added imports and integration comments

### 2. New Files Created
- **`line-style-persistence.js`**: Helper functions for JSON save/load integration
- **`ui-line-styles.js`**: UI event handlers for line style controls
- **`LINE_STYLE_INTEGRATION_GUIDE.md`**: This integration guide

## Integration Steps

### Step 1: Core Tree Integration

When the missing core tree files (`tree-core-canvas.js`, `tree.js`) are implemented, integrate the line style persistence:

```javascript
// In the core tree's getCurrentState() method
import { addLineStyleToState } from './line-style-persistence.js';

getCurrentState() {
  const state = {
    // ... existing state properties
  };
  
  // Add line style settings to the state
  return addLineStyleToState(state, this.canvasRenderer);
}

// In the core tree's processLoadedData() method
import { restoreLineStyleFromState, updateLineStyleUIControls } from './line-style-persistence.js';

processLoadedData(data) {
  // ... existing data processing
  
  // Restore line style settings
  restoreLineStyleFromState(data, this.canvasRenderer);
  
  // Update UI controls to reflect loaded settings
  updateLineStyleUIControls(this.canvasRenderer);
}
```

### Step 2: UI Controls Integration

Initialize the line style controls when the application starts:

```javascript
// In the main application initialization
import { setupLineStyleControls } from './ui-line-styles.js';

// After canvas renderer is created
setupLineStyleControls(canvasRenderer, treeCore);
```

### Step 3: Export Integration

Update export functions to pass line style settings:

```javascript
// In core-export.js or similar export handling
import { getLineStyleSettingsForExport } from './ui-line-styles.js';

// For SVG export
const lineStyleSettings = getLineStyleSettingsForExport(treeCore.canvasRenderer);
exportTree('svg', lineStyleSettings);

// For canvas-based exports, the canvas-renderer.js changes are already applied
```

## Enhanced JSON Structure

The line style settings will be saved in the JSON with this structure:

```json
{
  "version": "2.7",
  "timestamp": 1735574400000,
  "format": "MapMyRoots_Canvas_Enhanced",
  "backwards_compatible": true,
  "settings": {
    "nodeRadius": 50,
    "defaultColor": "#3498db",
    // ... existing settings
  },
  "lineStyleSettings": {
    "familyLineStyle": "solid",
    "familyLineThickness": 2,
    "familyLineColor": "#7f8c8d",
    "spouseLineStyle": "dashed",
    "spouseLineThickness": 2,
    "spouseLineColor": "#e74c3c",
    "lineOnlyStyle": "dash-dot",
    "lineOnlyThickness": 2,
    "lineOnlyColor": "#9b59b6",
    "showNodeOutline": false,
    "outlineColor": "#000000",
    "outlineThickness": 1
  },
  // ... rest of existing structure
}
```

## Testing the Fixes

### 1. Canvas Export Testing (Already Fixed)
- Change line styles in the UI
- Export as PNG/JPEG/PDF
- Verify exported files show the correct line styles

### 2. SVG Export Testing (Already Fixed)
- Change line styles in the UI
- Export as SVG
- Open SVG file and verify line styles match UI settings

### 3. JSON Persistence Testing (Requires Core Integration)
- Change line styles in the UI
- Save/Export JSON file
- Reload/Import JSON file
- Verify line styles are restored correctly

### 4. UI Integration Testing (Requires Core Integration)
- Change line styles using UI controls
- Verify changes are applied to canvas immediately
- Verify changes are saved automatically

## Line Style Options

The system supports these line styles for all connection types:

1. **Solid**: Continuous line
2. **Dashed**: Dashed pattern (8px dash, 4px gap)
3. **Dotted**: Dotted pattern (2px dash, 4px gap)
4. **Dash-Dot**: Mixed pattern (8px dash, 4px gap, 2px dash, 4px gap)

Each connection type (family, spouse, line-only) can have independent:
- Line style (solid, dashed, dotted, dash-dot)
- Line thickness (1-10 pixels)
- Line color (any hex color)

## Validation

The system includes validation for:
- **Thickness**: Must be between 1-10 pixels
- **Colors**: Must be valid hex colors (#RRGGBB format)
- **Styles**: Must be one of the supported line styles

## Backwards Compatibility

The fixes maintain backwards compatibility:
- Existing JSON files without `lineStyleSettings` will use default values
- The SVG export function accepts optional line style settings (defaults to current behavior if not provided)
- Canvas rendering continues to work with existing settings structure

## Error Handling

The system includes comprehensive error handling:
- Missing UI controls are handled gracefully
- Invalid line style settings fall back to defaults
- Export functions work with or without line style settings
- Validation errors are displayed to users with visual feedback

## Future Enhancements

Potential future improvements:
1. **More Line Styles**: Add more line patterns (double lines, wave patterns)
2. **Line Width Presets**: Add preset thickness options
3. **Color Themes**: Add predefined color schemes
4. **Advanced Styling**: Add gradient or shadow effects
5. **Connection-Specific Styles**: Allow different styles for different relationships

## Conclusion

These fixes provide a complete solution for the line style issues. The system is designed to be:
- **Backward compatible** with existing data
- **Extensible** for future enhancements
- **Robust** with comprehensive error handling
- **User-friendly** with real-time preview and validation

Once the core tree files are implemented and integrated according to this guide, users will be able to:
1. Change line styles in the UI
2. See changes applied immediately
3. Export files with correct line styles
4. Save and load line style preferences
5. Have their preferences persist across sessions
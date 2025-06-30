// line-style-persistence.js
// Helper functions for line style persistence in JSON save/load

/**
 * Adds line style settings to the state object for JSON export
 * This should be integrated into the core tree's getCurrentState() method
 */
export function addLineStyleToState(state, canvasRenderer) {
  if (!canvasRenderer || !canvasRenderer.settings) {
    return state;
  }

  // Add line style settings to the state
  state.lineStyleSettings = {
    familyLineStyle: canvasRenderer.settings.familyLineStyle || 'solid',
    familyLineThickness: canvasRenderer.settings.familyLineThickness || 2,
    familyLineColor: canvasRenderer.settings.familyLineColor || '#7f8c8d',
    
    spouseLineStyle: canvasRenderer.settings.spouseLineStyle || 'dashed',
    spouseLineThickness: canvasRenderer.settings.spouseLineThickness || 2,
    spouseLineColor: canvasRenderer.settings.spouseLineColor || '#e74c3c',
    
    lineOnlyStyle: canvasRenderer.settings.lineOnlyStyle || 'dash-dot',
    lineOnlyThickness: canvasRenderer.settings.lineOnlyThickness || 2,
    lineOnlyColor: canvasRenderer.settings.lineOnlyColor || '#9b59b6',
    
    // Additional settings that might be useful
    showNodeOutline: canvasRenderer.settings.showNodeOutline || false,
    outlineColor: canvasRenderer.settings.outlineColor || '#000000',
    outlineThickness: canvasRenderer.settings.outlineThickness || 1
  };

  return state;
}

/**
 * Restores line style settings from loaded JSON data
 * This should be integrated into the core tree's processLoadedData() method
 */
export function restoreLineStyleFromState(data, canvasRenderer) {
  if (!data.lineStyleSettings || !canvasRenderer || !canvasRenderer.settings) {
    return;
  }

  const lineStyleSettings = data.lineStyleSettings;

  // Restore family line settings
  if (lineStyleSettings.familyLineStyle !== undefined) {
    canvasRenderer.settings.familyLineStyle = lineStyleSettings.familyLineStyle;
  }
  if (lineStyleSettings.familyLineThickness !== undefined) {
    canvasRenderer.settings.familyLineThickness = lineStyleSettings.familyLineThickness;
  }
  if (lineStyleSettings.familyLineColor !== undefined) {
    canvasRenderer.settings.familyLineColor = lineStyleSettings.familyLineColor;
  }

  // Restore spouse line settings
  if (lineStyleSettings.spouseLineStyle !== undefined) {
    canvasRenderer.settings.spouseLineStyle = lineStyleSettings.spouseLineStyle;
  }
  if (lineStyleSettings.spouseLineThickness !== undefined) {
    canvasRenderer.settings.spouseLineThickness = lineStyleSettings.spouseLineThickness;
  }
  if (lineStyleSettings.spouseLineColor !== undefined) {
    canvasRenderer.settings.spouseLineColor = lineStyleSettings.spouseLineColor;
  }

  // Restore line-only settings
  if (lineStyleSettings.lineOnlyStyle !== undefined) {
    canvasRenderer.settings.lineOnlyStyle = lineStyleSettings.lineOnlyStyle;
  }
  if (lineStyleSettings.lineOnlyThickness !== undefined) {
    canvasRenderer.settings.lineOnlyThickness = lineStyleSettings.lineOnlyThickness;
  }
  if (lineStyleSettings.lineOnlyColor !== undefined) {
    canvasRenderer.settings.lineOnlyColor = lineStyleSettings.lineOnlyColor;
  }

  // Restore additional settings
  if (lineStyleSettings.showNodeOutline !== undefined) {
    canvasRenderer.settings.showNodeOutline = lineStyleSettings.showNodeOutline;
  }
  if (lineStyleSettings.outlineColor !== undefined) {
    canvasRenderer.settings.outlineColor = lineStyleSettings.outlineColor;
  }
  if (lineStyleSettings.outlineThickness !== undefined) {
    canvasRenderer.settings.outlineThickness = lineStyleSettings.outlineThickness;
  }
}

/**
 * Updates UI controls to reflect current line style settings
 * This should be integrated into the UI update system
 */
export function updateLineStyleUIControls(canvasRenderer) {
  if (!canvasRenderer || !canvasRenderer.settings) {
    return;
  }

  const settings = canvasRenderer.settings;

  // Update family line controls
  const familyStyleSelect = document.getElementById('familyLineStyleSelect');
  const familyThicknessInput = document.getElementById('familyLineThicknessInput');
  const familyColorPicker = document.getElementById('familyLineColorPicker');

  if (familyStyleSelect) familyStyleSelect.value = settings.familyLineStyle || 'solid';
  if (familyThicknessInput) familyThicknessInput.value = settings.familyLineThickness || 2;
  if (familyColorPicker) familyColorPicker.value = settings.familyLineColor || '#7f8c8d';

  // Update spouse line controls
  const spouseStyleSelect = document.getElementById('spouseLineStyleSelect');
  const spouseThicknessInput = document.getElementById('spouseLineThicknessInput');
  const spouseColorPicker = document.getElementById('spouseLineColorPicker');

  if (spouseStyleSelect) spouseStyleSelect.value = settings.spouseLineStyle || 'dashed';
  if (spouseThicknessInput) spouseThicknessInput.value = settings.spouseLineThickness || 2;
  if (spouseColorPicker) spouseColorPicker.value = settings.spouseLineColor || '#e74c3c';

  // Update line-only controls
  const lineOnlyStyleSelect = document.getElementById('lineOnlyStyleSelect');
  const lineOnlyThicknessInput = document.getElementById('lineOnlyThicknessInput');
  const lineOnlyColorPicker = document.getElementById('lineOnlyColorPicker');

  if (lineOnlyStyleSelect) lineOnlyStyleSelect.value = settings.lineOnlyStyle || 'dash-dot';
  if (lineOnlyThicknessInput) lineOnlyThicknessInput.value = settings.lineOnlyThickness || 2;
  if (lineOnlyColorPicker) lineOnlyColorPicker.value = settings.lineOnlyColor || '#9b59b6';
}

/**
 * Example of enhanced JSON structure with line style settings
 */
export const EXAMPLE_JSON_WITH_LINE_STYLES = {
  "version": "2.7",
  "timestamp": Date.now(),
  "format": "MapMyRoots_Canvas_Enhanced",
  "backwards_compatible": true,
  "settings": {
    "nodeRadius": 50,
    "defaultColor": "#3498db",
    "fontFamily": "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    "fontSize": 12,
    "nameColor": "#000000",
    "dateColor": "#000000"
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
  "displayPreferences": {
    "showMaidenName": true,
    "showDateOfBirth": true,
    "showFatherName": true
  },
  // ... rest of the JSON structure
};
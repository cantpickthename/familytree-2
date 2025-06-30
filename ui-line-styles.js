// ui-line-styles.js
// UI event handlers for line style controls

import { updateLineStyleUIControls } from './line-style-persistence.js';

/**
 * Sets up event handlers for all line style controls
 * This should be called when the application initializes
 */
export function setupLineStyleControls(canvasRenderer, treeCore = null) {
  if (!canvasRenderer) {
    console.error('Canvas renderer is required for line style controls');
    return;
  }

  // Get all the UI controls
  const controls = {
    // Family line controls
    familyStyleSelect: document.getElementById('familyLineStyleSelect'),
    familyThicknessInput: document.getElementById('familyLineThicknessInput'),
    familyColorPicker: document.getElementById('familyLineColorPicker'),
    
    // Spouse line controls
    spouseStyleSelect: document.getElementById('spouseLineStyleSelect'),
    spouseThicknessInput: document.getElementById('spouseLineThicknessInput'),
    spouseColorPicker: document.getElementById('spouseLineColorPicker'),
    
    // Line-only controls
    lineOnlyStyleSelect: document.getElementById('lineOnlyStyleSelect'),
    lineOnlyThicknessInput: document.getElementById('lineOnlyThicknessInput'),
    lineOnlyColorPicker: document.getElementById('lineOnlyColorPicker'),
    
    // Apply button
    applyButton: document.getElementById('applyLineStyles')
  };

  // Helper function to update canvas renderer settings
  function updateRendererSettings() {
    const settings = canvasRenderer.settings;
    
    // Update family line settings
    if (controls.familyStyleSelect) {
      settings.familyLineStyle = controls.familyStyleSelect.value;
    }
    if (controls.familyThicknessInput) {
      settings.familyLineThickness = parseInt(controls.familyThicknessInput.value) || 2;
    }
    if (controls.familyColorPicker) {
      settings.familyLineColor = controls.familyColorPicker.value;
    }
    
    // Update spouse line settings
    if (controls.spouseStyleSelect) {
      settings.spouseLineStyle = controls.spouseStyleSelect.value;
    }
    if (controls.spouseThicknessInput) {
      settings.spouseLineThickness = parseInt(controls.spouseThicknessInput.value) || 2;
    }
    if (controls.spouseColorPicker) {
      settings.spouseLineColor = controls.spouseColorPicker.value;
    }
    
    // Update line-only settings
    if (controls.lineOnlyStyleSelect) {
      settings.lineOnlyStyle = controls.lineOnlyStyleSelect.value;
    }
    if (controls.lineOnlyThicknessInput) {
      settings.lineOnlyThickness = parseInt(controls.lineOnlyThicknessInput.value) || 2;
    }
    if (controls.lineOnlyColorPicker) {
      settings.lineOnlyColor = controls.lineOnlyColorPicker.value;
    }
  }

  // Helper function to apply changes and refresh the display
  function applyLineStyleChanges() {
    updateRendererSettings();
    
    // Trigger canvas redraw
    if (canvasRenderer.render) {
      canvasRenderer.render();
    } else if (canvasRenderer.draw) {
      canvasRenderer.draw();
    }
    
    // Trigger auto-save if tree core is available
    if (treeCore && treeCore.triggerAutoSave) {
      treeCore.triggerAutoSave();
    }
    
    // Show success notification
    if (window.notifications) {
      window.notifications.success('Line Styles Updated', 'Line style changes have been applied');
    }
  }

  // Set up Apply button handler
  if (controls.applyButton) {
    controls.applyButton.addEventListener('click', (e) => {
      e.preventDefault();
      applyLineStyleChanges();
    });
  }

  // Set up real-time preview handlers (optional - apply changes immediately)
  const setupRealTimeHandler = (control) => {
    if (control) {
      control.addEventListener('change', () => {
        // Apply changes immediately for real-time preview
        updateRendererSettings();
        if (canvasRenderer.render) {
          canvasRenderer.render();
        } else if (canvasRenderer.draw) {
          canvasRenderer.draw();
        }
      });
    }
  };

  // Enable real-time preview for all controls
  Object.values(controls).forEach(control => {
    if (control && control !== controls.applyButton) {
      setupRealTimeHandler(control);
    }
  });

  // Initialize UI controls with current settings
  updateLineStyleUIControls(canvasRenderer);

  console.log('Line style controls initialized successfully');
}

/**
 * Updates the line style settings for exports
 * This function should be called before exporting to ensure exports use current settings
 */
export function getLineStyleSettingsForExport(canvasRenderer) {
  if (!canvasRenderer || !canvasRenderer.settings) {
    return null;
  }

  return {
    familyLineStyle: canvasRenderer.settings.familyLineStyle || 'solid',
    familyLineThickness: canvasRenderer.settings.familyLineThickness || 2,
    familyLineColor: canvasRenderer.settings.familyLineColor || '#7f8c8d',
    spouseLineStyle: canvasRenderer.settings.spouseLineStyle || 'dashed',
    spouseLineThickness: canvasRenderer.settings.spouseLineThickness || 2,
    spouseLineColor: canvasRenderer.settings.spouseLineColor || '#e74c3c',
    lineOnlyStyle: canvasRenderer.settings.lineOnlyStyle || 'dash-dot',
    lineOnlyThickness: canvasRenderer.settings.lineOnlyThickness || 2,
    lineOnlyColor: canvasRenderer.settings.lineOnlyColor || '#9b59b6'
  };
}

/**
 * Validates line style input values
 */
export function validateLineStyleInputs() {
  const validationErrors = [];
  
  // Validate thickness inputs
  const thicknessInputs = [
    { id: 'familyLineThicknessInput', name: 'Family Line Thickness' },
    { id: 'spouseLineThicknessInput', name: 'Spouse Line Thickness' },
    { id: 'lineOnlyThicknessInput', name: 'Line-Only Thickness' }
  ];
  
  thicknessInputs.forEach(input => {
    const element = document.getElementById(input.id);
    if (element) {
      const value = parseInt(element.value);
      if (isNaN(value) || value < 1 || value > 10) {
        validationErrors.push(`${input.name} must be between 1 and 10 pixels`);
        element.style.borderColor = '#e74c3c';
      } else {
        element.style.borderColor = '';
      }
    }
  });
  
  // Validate color inputs
  const colorInputs = [
    { id: 'familyLineColorPicker', name: 'Family Line Color' },
    { id: 'spouseLineColorPicker', name: 'Spouse Line Color' },
    { id: 'lineOnlyColorPicker', name: 'Line-Only Color' }
  ];
  
  colorInputs.forEach(input => {
    const element = document.getElementById(input.id);
    if (element) {
      const value = element.value;
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
        validationErrors.push(`${input.name} must be a valid hex color`);
        element.style.borderColor = '#e74c3c';
      } else {
        element.style.borderColor = '';
      }
    }
  });
  
  return validationErrors;
}

/**
 * Reset line styles to default values
 */
export function resetLineStylesToDefaults(canvasRenderer) {
  if (!canvasRenderer || !canvasRenderer.settings) {
    return;
  }

  // Reset to default values
  canvasRenderer.settings.familyLineStyle = 'solid';
  canvasRenderer.settings.familyLineThickness = 2;
  canvasRenderer.settings.familyLineColor = '#7f8c8d';
  
  canvasRenderer.settings.spouseLineStyle = 'dashed';
  canvasRenderer.settings.spouseLineThickness = 2;
  canvasRenderer.settings.spouseLineColor = '#e74c3c';
  
  canvasRenderer.settings.lineOnlyStyle = 'dash-dot';
  canvasRenderer.settings.lineOnlyThickness = 2;
  canvasRenderer.settings.lineOnlyColor = '#9b59b6';

  // Update UI controls
  updateLineStyleUIControls(canvasRenderer);
  
  // Trigger redraw
  if (canvasRenderer.render) {
    canvasRenderer.render();
  } else if (canvasRenderer.draw) {
    canvasRenderer.draw();
  }
  
  if (window.notifications) {
    window.notifications.success('Line Styles Reset', 'Line styles have been reset to default values');
  }
}
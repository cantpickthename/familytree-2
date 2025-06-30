// tree.js - Main entry point for the family tree application
// Enhanced with event-driven architecture and security

import { CanvasRenderer } from './canvas-renderer.js';
import { CacheManager } from './core-cache.js';
import { UndoRedoManager } from './core-undoRedo.js';
import { setupExport } from './core-export.js';
import { setupLineStyleControls } from './ui-line-styles.js';
import { addLineStyleToState, restoreLineStyleFromState } from './line-style-persistence.js';
import { notifications } from './notifications.js';

// TreeCoreCanvas - Main application controller
export class TreeCoreCanvas {
  constructor() {
    this.renderer = null;
    this.cacheManager = null;
    this.undoRedoManager = null;
    this.personData = new Map();
    this.hiddenConnections = new Set();
    this.lineOnlyConnections = new Set();
    
    // Display preferences
    this.displayPreferences = {
      showMaidenName: true,
      showDateOfBirth: true,
      showFatherName: true
    };
    
    // Node settings
    this.nodeStyle = 'circle';
    this.nodeRadius = 50;
    this.defaultColor = '#3498db';
    this.fontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
    this.fontSize = 12;
    this.nameColor = '#000000';
    this.dateColor = '#000000';
    
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🌳 Initializing TreeCoreCanvas...');
      
      // Initialize canvas renderer
      const canvas = document.getElementById('treeCanvas');
      if (!canvas) {
        throw new Error('Canvas element not found');
      }
      
      this.renderer = new CanvasRenderer(canvas);
      
      // Initialize cache manager
      this.cacheManager = new CacheManager(this);
      this.cacheManager.setupCaching();
      
      // Initialize undo/redo manager
      this.undoRedoManager = new UndoRedoManager(this, notifications);
      
      // Set up export functionality
      setupExport(this);
      
      // Set up line style controls
      setupLineStyleControls(this.renderer, this);
      
      // Try to load cached state
      const loaded = await this.cacheManager.loadCachedState();
      if (!loaded) {
        // Initialize with default state
        this.undoRedoManager.pushUndoState();
      }
      
      this.isInitialized = true;
      console.log('✅ TreeCoreCanvas initialized successfully');
      
      // Show success notification
      notifications.success('Application Ready', 'Family tree builder is ready to use');
      
    } catch (error) {
      console.error('❌ Failed to initialize TreeCoreCanvas:', error);
      notifications.error('Initialization Failed', 'Failed to initialize the application');
      throw error;
    }
  }

  // Get current state for saving/export
  getCurrentState() {
    const state = {
      version: '2.7',
      timestamp: Date.now(),
      format: 'MapMyRoots_Canvas_Enhanced',
      backwards_compatible: true,
      
      // Core data
      persons: Array.from(this.personData.values()),
      
      // Settings
      settings: {
        nodeRadius: this.nodeRadius,
        defaultColor: this.defaultColor,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        nameColor: this.nameColor,
        dateColor: this.dateColor
      },
      
      // Display preferences
      displayPreferences: { ...this.displayPreferences },
      nodeStyle: this.nodeStyle,
      
      // Camera state
      camera: this.renderer ? this.renderer.getCamera() : { x: 0, y: 0, scale: 1 },
      
      // Connection state
      hiddenConnections: Array.from(this.hiddenConnections),
      lineOnlyConnections: Array.from(this.lineOnlyConnections)
    };
    
    // Add line style settings using helper function
    return addLineStyleToState(state, this.renderer);
  }

  // Process loaded data
  processLoadedData(data) {
    try {
      // Validate data format
      if (!data.version && !data.persons) {
        throw new Error('Invalid data format');
      }
      
      // Load persons data
      if (data.persons) {
        this.personData = new Map();
        data.persons.forEach(person => {
          this.personData.set(person.id, person);
        });
      }
      
      // Load settings
      if (data.settings) {
        this.nodeRadius = data.settings.nodeRadius || this.nodeRadius;
        this.defaultColor = data.settings.defaultColor || this.defaultColor;
        this.fontFamily = data.settings.fontFamily || this.fontFamily;
        this.fontSize = data.settings.fontSize || this.fontSize;
        this.nameColor = data.settings.nameColor || this.nameColor;
        this.dateColor = data.settings.dateColor || this.dateColor;
      }
      
      // Load display preferences
      if (data.displayPreferences) {
        this.displayPreferences = { ...data.displayPreferences };
      }
      
      // Load node style
      if (data.nodeStyle) {
        this.nodeStyle = data.nodeStyle;
      }
      
      // Load camera state
      if (data.camera && this.renderer) {
        this.renderer.setCamera(data.camera.x, data.camera.y, data.camera.scale);
      }
      
      // Load connection state
      if (data.hiddenConnections) {
        this.hiddenConnections = new Set(data.hiddenConnections);
      }
      if (data.lineOnlyConnections) {
        this.lineOnlyConnections = new Set(data.lineOnlyConnections);
      }
      
      // Restore line style settings using helper function
      restoreLineStyleFromState(data, this.renderer);
      
      // Update renderer and UI
      this.updateRendererSettings();
      this.regenerateConnections();
      
      console.log('✅ Data loaded successfully');
      notifications.success('Data Loaded', 'Family tree data has been loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to process loaded data:', error);
      notifications.error('Load Failed', 'Failed to load family tree data');
      throw error;
    }
  }

  // Update renderer settings
  updateRendererSettings() {
    if (!this.renderer) return;
    
    // Update basic settings
    this.renderer.updateSettings({
      nodeRadius: this.nodeRadius,
      defaultColor: this.defaultColor,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      nameColor: this.nameColor,
      dateColor: this.dateColor
    });
    
    // Trigger redraw
    this.renderer.render();
  }

  // Regenerate connections
  regenerateConnections() {
    if (!this.renderer) return;
    
    // This would regenerate connections based on person data
    // Implementation depends on how connections are stored
    console.log('🔄 Regenerating connections...');
  }

  // Clear selection
  clearSelection() {
    if (!this.renderer) return;
    this.renderer.clearSelection();
  }

  // Auto-save functionality
  autoSave() {
    if (this.cacheManager) {
      this.cacheManager.autoSave();
    }
  }

  // Trigger auto-save
  triggerAutoSave() {
    setTimeout(() => this.autoSave(), 100);
  }

  // Export methods (placeholder implementations)
  exportCanvasAsSVG() {
    console.log('📤 Exporting as SVG...');
    // Implementation would use the exporter with line style settings
  }

  exportCanvasAsPNG() {
    console.log('📤 Exporting as PNG...');
    // Implementation would use the canvas renderer export
    if (this.renderer) {
      this.renderer.exportAsPNG();
    }
  }

  exportCanvasAsPNGTransparent() {
    console.log('📤 Exporting as PNG (transparent)...');
    // Implementation would use the canvas renderer export
    if (this.renderer) {
      this.renderer.exportAsPNG(true);
    }
  }

  exportCanvasAsJPEG() {
    console.log('📤 Exporting as JPEG...');
    // Implementation would use the canvas renderer export
    if (this.renderer) {
      this.renderer.exportAsJPEG();
    }
  }

  // Clean old backups
  cleanOldBackups() {
    // Implementation for cleaning old backup files
    const maxBackups = 10;
    const backupKeys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('familyTreeCanvas_state_backup_')) {
        backupKeys.push(key);
      }
    }
    
    if (backupKeys.length > maxBackups) {
      // Sort by timestamp and remove oldest
      backupKeys.sort().slice(0, backupKeys.length - maxBackups).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }
}

// Global tree core instance
let treeCore = null;

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Starting Family Tree Application...');
    
    treeCore = new TreeCoreCanvas();
    await treeCore.initialize();
    
    // Make tree core globally available for debugging
    window.treeCore = treeCore;
    
  } catch (error) {
    console.error('💥 Application failed to start:', error);
  }
});

// Export for module usage
export default TreeCoreCanvas;
export { treeCore };
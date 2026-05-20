/**
 * Simple Monitor SDK - Utility Functions
 *
 * This package contains utility functions used across the SDK.
 * All utilities are platform-agnostic and contain no monitoring business logic.
 *
 * @module @simple-monitor/utils
 */

// Global Variable Management
export * from './global';

// Type Detection
export * from './is';

// String Utilities
export * from './string';

// Flag Management
export * from './flag';

// Event Listeners
export * from './event';

// Logger
export * from './logger';

// Time Utilities
export * from './time';

// Function Utilities
export * from './function';

// Throttle & Debounce
export * from './throttle';

// Queue Utilities
export * from './queue';

// Environment Detection
export * from './env';

// Error Stack Parser
export * from './stack-trace';

// API Interceptor (replaceOld)
export * from './interceptor';

// Error Capture Utilities
export * from './error-catch';

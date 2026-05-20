/**
 * Options Management Module
 *
 * Manages SDK initialization configuration using closure pattern.
 * This module serves as the configuration center for the entire SDK.
 *
 * @module options
 */

import type { InitOptions } from '@simple-monitor/types'
import { DEFAULT_OPTIONS } from '@simple-monitor/shared'

/**
 * Internal configuration storage
 * Stores the merged configuration (user options + defaults)
 */
let _options: InitOptions

/**
 * Initialization flag
 * Tracks whether the SDK has been initialized
 */
let _isInitialized = false

/**
 * Initialize SDK options
 * Merges user configuration with default values
 *
 * @param opts - User provided configuration options
 * @throws {Error} If dsn is not provided
 */
export function initOptions(opts: InitOptions): void {
  // Validate required fields
  if (!opts.dsn) {
    throw new Error('[Simple Monitor] dsn is required for initialization')
  }

  // Deep merge with default values
  // Use spread operator for shallow merge (sufficient for flat config)
  _options = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  // Mark as initialized
  _isInitialized = true
}

/**
 * Get all configuration options
 * Returns a copy to prevent external modification
 *
 * @returns Complete configuration object
 * @throws {Error} If SDK is not initialized
 */
export function getOptions(): InitOptions {
  if (!_isInitialized) {
    throw new Error('[Simple Monitor] SDK is not initialized. Call initOptions() first.')
  }

  // Return a copy to prevent external modification
  return { ..._options }
}

/**
 * Get a single configuration option by key
 * Provides type-safe access to individual options
 *
 * @template K - Type of the option key
 * @param key - The configuration key to retrieve
 * @returns The value associated with the key
 * @throws {Error} If SDK is not initialized
 *
 * @example
 * ```typescript
 * const dsn = getOption('dsn');  // string
 * const maxBreadcrumbs = getOption('maxBreadcrumbs');  // number
 * ```
 */
export function getOption<K extends keyof InitOptions>(key: K): InitOptions[K] {
  if (!_isInitialized) {
    throw new Error('[Simple Monitor] SDK is not initialized. Call initOptions() first.')
  }

  return _options[key]
}

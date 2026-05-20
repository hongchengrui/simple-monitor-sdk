/**
 * API Interceptor Utility
 *
 * Provides the ability to intercept/replace native methods with custom implementations.
 * This is used for monitoring purposes - wrapping native APIs to capture events.
 *
 * @module interceptor
 */

/**
 * Generic object type for flexible data structures
 */
export type AnyObject = Record<string, any>;

/**
 * Callback type for the intercepted function
 * Receives the original function and returns the wrapped function
 */
export type InterceptorCallback<T = any> = (original: T) => T;

/**
 * Replaces a method on an object with a wrapped version.
 *
 * This function saves the original method, wraps it with the provided callback,
 * and replaces it on the source object. This enables monitoring of native APIs.
 *
 * @param source - The object containing the method to replace (e.g., XMLHttpRequest.prototype)
 * @param name - The name of the method to replace (e.g., 'open', 'send')
 * @param replacement - A function that receives the original and returns the wrapped version
 * @param isForced - Force replacement even if the property doesn't exist on source
 *
 * @example
 * ```ts
 * // Intercept XMLHttpRequest.open
 * replaceOld(
 *   XMLHttpRequest.prototype,
 *   'open',
 *   (originalOpen) => {
 *     return function(this: MonitorXHR, ...args: any[]) {
 *       // Monitoring logic here
 *       console.log('XHR opened', args);
 *       return originalOpen.apply(this, args);
 *     };
 *   }
 * );
 * ```
 */
export function replaceOld(
  source: AnyObject,
  name: string,
  replacement: InterceptorCallback,
  isForced = false,
): void {
  // Source validation
  if (source === undefined || source === null) {
    return;
  }

  // Check if property exists or forced replacement
  if (name in source || isForced) {
    // Save original function
    const original = source[name];

    // Create wrapped function
    const wrapped = replacement(original);

    // Replace if result is a valid function
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}

/**
 * Restores a previously replaced method to its original implementation.
 *
 * @param source - The object containing the method
 * @param name - The name of the method to restore
 * @param original - The original function to restore
 */
export function restoreMethod(
  source: AnyObject,
  name: string,
  original: any,
): void {
  if (source && name && typeof original === 'function') {
    source[name] = original;
  }
}

/**
 * Checks if a method has been replaced/wrapped.
 *
 * @param source - The object containing the method
 * @param name - The name of the method to check
 * @returns true if the method exists and is a function
 */
export function isMethodReplaced(source: AnyObject, name: string): boolean {
  return !!(source && name && typeof source[name] === 'function');
}

/**
 * Global tracker for all intercepted methods to allow restoration.
 * Maps: sourceObject_propertyName -> originalFunction
 */
const interceptRegistry = new WeakMap<AnyObject, Map<string, any>>();

/**
 * Replace a method and register it for potential restoration.
 *
 * @param source - The object containing the method
 * @param name - The name of the method
 * @param replacement - The wrapping callback
 * @param isForced - Force replacement
 * @returns A function to restore the original method
 */
export function replaceTrackable(
  source: AnyObject,
  name: string,
  replacement: InterceptorCallback,
  isForced = false,
): () => void {
  // Get or create registry for this source
  let sourceRegistry = interceptRegistry.get(source);
  if (!sourceRegistry) {
    sourceRegistry = new Map();
    interceptRegistry.set(source, sourceRegistry);
  }

  // Save original if not already saved
  if (!sourceRegistry.has(name)) {
    sourceRegistry.set(name, source[name]);
  }

  const original = sourceRegistry.get(name);

  // Perform replacement
  replaceOld(source, name, replacement, isForced);

  // Return restoration function
  return () => {
    restoreMethod(source, name, original);
  };
}

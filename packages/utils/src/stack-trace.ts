/**
 * Error Stack Trace Parser
 *
 * Parses error stack traces into structured format across different browsers/environments.
 * Handles Chrome, Firefox, Safari, and other browser stack formats.
 *
 * @module stack-trace
 */

/**
 * Stack frame structure for error parsing
 */
export interface StackFrame {
  /** File URL where the error occurred */
  url: string;

  /** Function name */
  func: string;

  /** Function arguments */
  args: any[];

  /** Line number (1-indexed) */
  line: number;

  /** Column number (1-indexed) */
  col: number;
}

/**
 * Regular expressions for parsing different browser stack formats
 */
const STACK_PATTERNS = {
  // Chrome/Edge: "    at functionName (http://path:line:column)"
  // "    at http://path:line:column"
  chrome: /^\s*at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?\s*$/,

  // Firefox: "functionName@http://path:line:column"
  // "@http://path:line:column"
  firefox: /^(.+)?@(.+?):(\d+):(\d+)\s*$/,

  // Safari/IE: "functionName(path:line:column)"
  // "path:line:column"
  safari: /^(.+)?\s+(.+?):(\d+):(\d+)\s*$/,

  // Node.js: similar to Chrome but with different paths
  node: /^\s*at\s+(.+?)\s+\((.+):(\d+):(\d+)\)\s*$/,
};

/**
 * Detects which pattern to use for parsing the stack line.
 *
 * @param line - A single line from the stack trace
 * @returns The matched pattern name or null
 */
function detectPattern(line: string): keyof typeof STACK_PATTERNS | null {
  if (line.includes(' at ')) {
    return 'chrome';
  }
  if (line.includes('@')) {
    return 'firefox';
  }
  if (/\(.+:\d+:\d+\)/.test(line)) {
    return 'safari';
  }
  return null;
}

/**
 * Parses a single stack trace line into a StackFrame.
 *
 * @param line - A single line from the stack trace
 * @returns Parsed StackFrame or null if parsing fails
 */
function parseStackLine(line: string): StackFrame | null {
  // Remove any leading/trailing whitespace
  line = line.trim();

  // Skip empty lines or internal error messages
  if (!line || line.startsWith('Error:') || line.startsWith('console.')) {
    return null;
  }

  const pattern = detectPattern(line);
  if (!pattern) {
    return null;
  }

  const regex = STACK_PATTERNS[pattern];
  const match = line.match(regex);

  if (!match) {
    return null;
  }

  const [, func, url, lineNum, colNum] = match;

  return {
    url: url || '',
    func: func || '(anonymous)',
    args: [],
    line: lineNum ? parseInt(lineNum, 10) : 0,
    col: colNum ? parseInt(colNum, 10) : 0,
  };
}

/**
 * Parses an error object's stack trace into structured frames.
 *
 * @param error - The error object with a stack property
 * @returns Array of parsed StackFrame objects
 */
export function parseErrorStack(error: Error): StackFrame[] {
  const stack = error?.stack;
  if (!stack || typeof stack !== 'string') {
    return [];
  }

  // Split stack trace into lines
  const lines = stack.split('\n');

  // Parse each line and filter out null results
  const frames: StackFrame[] = [];
  for (const line of lines) {
    const frame = parseStackLine(line);
    if (frame) {
      frames.push(frame);
    }
  }

  return frames;
}

/**
 * Parses a raw stack trace string into structured frames.
 *
 * @param stackString - The raw stack trace string
 * @returns Array of parsed StackFrame objects
 */
export function parseStackString(stackString: string): StackFrame[] {
  if (!stackString || typeof stackString !== 'string') {
    return [];
  }

  const lines = stackString.split('\n');
  const frames: StackFrame[] = [];

  for (const line of lines) {
    const frame = parseStackLine(line);
    if (frame) {
      frames.push(frame);
    }
  }

  return frames;
}

/**
 * Formats a StackFrame back into a readable string.
 *
 * @param frame - The stack frame to format
 * @returns Formatted string representation
 */
export function formatStackFrame(frame: StackFrame): string {
  const func = frame.func || '(anonymous)';
  const url = frame.url || 'unknown';
  const line = frame.line || 0;
  const col = frame.col || 0;

  return `    at ${func} (${url}:${line}:${col})`;
}

/**
 * Converts an array of StackFrames back into a stack trace string.
 *
 * @param frames - Array of stack frames
 * @returns Formatted stack trace string
 */
export function formatStackTrace(frames: StackFrame[]): string {
  if (!frames || frames.length === 0) {
    return '';
  }

  return frames.map(formatStackFrame).join('\n');
}

/**
 * Gets the topmost (most recent) stack frame from an error.
 *
 * @param error - The error object
 * @returns The topmost StackFrame or null
 */
export function getTopFrame(error: Error): StackFrame | null {
  const frames = parseErrorStack(error);
  return frames.length > 0 ? frames[0] : null;
}

/**
 * Gets the file path from the topmost stack frame.
 * Useful for determining where an error originated.
 *
 * @param error - The error object
 * @returns The file path or null
 */
export function getErrorFile(error: Error): string | null {
  const frame = getTopFrame(error);
  return frame?.url || null;
}

/**
 * Gets the line number from the topmost stack frame.
 *
 * @param error - The error object
 * @returns The line number or null
 */
export function getErrorLine(error: Error): number | null {
  const frame = getTopFrame(error);
  return frame?.line ?? null;
}

/**
 * Truncates the stack trace to a maximum number of frames.
 *
 * @param frames - Array of stack frames
 * @param maxFrames - Maximum number of frames to keep
 * @returns Truncated array of frames
 */
export function truncateStackTrace(frames: StackFrame[], maxFrames: number = 20): StackFrame[] {
  if (!frames || frames.length <= maxFrames) {
    return frames;
  }

  return frames.slice(0, maxFrames);
}

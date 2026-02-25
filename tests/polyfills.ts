/**
 * Polyfills for Node.js environment during tests
 */

import { TransformStream } from 'node:stream/web';
import { TextEncoder, TextDecoder } from 'node:util';

if (typeof (global as any).TransformStream === 'undefined') {
  (global as any).TransformStream = TransformStream;
}

if (typeof (global as any).TextEncoder === 'undefined') {
  (global as any).TextEncoder = TextEncoder;
  (global as any).TextDecoder = TextDecoder;
}

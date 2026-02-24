import { TransformStream } from 'node:stream/web';

if (typeof (globalThis as any).TransformStream === 'undefined') {
  (globalThis as any).TransformStream = TransformStream;
}

export default function globalSetup() {
  // Global setup logic
}

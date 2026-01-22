import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import './__mocks__/ky-universal';
import './__mocks__/next-config';
import './__mocks__/next-router';

// biome-ignore lint/suspicious/noExplicitAny: No typing yet
declare const window: any;

window.scrollTo = vi.fn();

// Suppress specific console.warn messages during tests
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
	const message = args[0];
	if (typeof message === 'string' && message.includes('No translated pages/routes found')) {
		return;
	}
	originalWarn.apply(console, args);
};

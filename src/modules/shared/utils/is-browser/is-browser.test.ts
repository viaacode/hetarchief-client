import { isBrowser } from './is-browser';

describe('Utils', () => {
	describe('isBrowser()', () => {
		let windowSpy: jest.SpyInstance<Partial<Window> | undefined>;

		beforeEach(() => {
			windowSpy = jest.spyOn(window, 'window', 'get');
		});

		afterEach(() => {
			windowSpy.mockRestore();
		});

		it('should return true when window is defined', () => {
			expect(isBrowser()).toBe(true);
		});

		it('should return false when window is undefined', () => {
			windowSpy.mockImplementation(() => undefined);

			expect(isBrowser()).toBe(false);
		});
	});
});

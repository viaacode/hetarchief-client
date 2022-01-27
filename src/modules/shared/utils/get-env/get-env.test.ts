import { getEnv } from './get-env';

describe('Utils', () => {
	describe('getEnv()', () => {
		// Keep backup of original env vars to make sure our test cases are isolated
		// and no side effects are created with other cases
		const originalEnv = process.env;

		beforeEach(() => {
			jest.resetModules();
		});

		afterEach(() => {
			// Restore original env vars
			process.env = originalEnv;
		});

		it('Should return an env value', () => {
			const customPort = 6000;
			process.env = {
				...originalEnv,
				PORT: customPort.toString(),
			};
			const envPort = getEnv('PORT');
			expect(envPort).toBe(customPort.toString());
		});

		it('Should return an empty string if the key is not found', () => {
			const envVar = getEnv('NOT_A_KEY');
			expect(envVar).toBe('');
		});
	});
});

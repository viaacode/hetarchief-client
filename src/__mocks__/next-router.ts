import { vi } from 'vitest';

vi.mock('next/router', () => ({
	useRouter: () => {
		return {
			asPath: 'http://hetarchief.be',
			push: vi.fn(),
			replace: vi.fn(),
		};
	},
}));

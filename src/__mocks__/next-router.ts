export default jest.mock('next/router', () => ({
	useRouter: () => {
		return {
			asPath: 'http://hetarchief.be',
			push: jest.fn(),
			replace: jest.fn(),
		};
	},
}));

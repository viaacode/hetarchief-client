export default jest.mock('next/router', () => ({
	useRouter: () => {
		return {
			asPath: 'http://hetarchief.be',
		};
	},
}));

export default jest.mock('ky-universal', () => ({
	create: () => () => ({
		json: () => null,
	}),
}));

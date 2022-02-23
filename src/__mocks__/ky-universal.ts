const json = () => null;
const kyResponse = { json };

const kyInstance = () => kyResponse;
kyInstance.get = () => kyResponse;

const create = () => kyInstance;

export default jest.mock('ky-universal', () => ({
	create,
}));

import { vi } from 'vitest';

const json = () => null;
const kyResponse = { json };

const kyInstance = () => kyResponse;
kyInstance.get = () => kyResponse;

const create = () => kyInstance;

const kyMock = {
	create,
	default: { create },
};

vi.mock('ky-universal', () => kyMock);

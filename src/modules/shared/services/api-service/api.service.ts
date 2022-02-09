import ky from 'ky-universal';

export abstract class ApiService {
	protected baseUrl: string;
	protected api: typeof ky;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		this.api = ky.create({ prefixUrl: this.baseUrl });
	}
}

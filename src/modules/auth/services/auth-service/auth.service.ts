import ky from 'ky-universal';
import { KyInstance } from 'ky/distribution/types/ky';
import queryString from 'query-string';

import { CheckLoginResponse } from './auth.service.types';

class AuthService {
	private baseUrl = '/api/proxy/auth';
	private api: KyInstance;

	constructor() {
		this.api = ky.create({ prefixUrl: this.baseUrl });
	}

	public async checkLogin(absoluteUrl?: string): Promise<CheckLoginResponse> {
		// Absolute url is necessary for accessing the proxy on the server side
		const options = absoluteUrl ? { prefixUrl: `${absoluteUrl}/auth` } : {};
		return await this.api('check-login', options).json();
	}

	public redirectToLogin() {
		const returnToUrl = process.env.NEXT_PUBLIC_ORIGIN;

		window.location.href = `${this.baseUrl}/hetarchief/login?${queryString.stringify({
			returnToUrl,
		})}`;
	}

	public async logout() {
		const returnToUrl = process.env.NEXT_PUBLIC_ORIGIN;

		window.location.href = `${this.baseUrl}/global-logout?${queryString.stringify({
			returnToUrl,
		})}`;
	}
}

export const authService = new AuthService();

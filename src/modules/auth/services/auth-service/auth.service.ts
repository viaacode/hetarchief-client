import ky from 'ky-universal';
import queryString from 'query-string';

import { getEnv } from '@shared/utils';

class AuthService {
	public async checkLogin() {
		return await ky('').json();
	}

	public redirectToLogin() {
		const returnToUrl = `${getEnv('ORIGIN')}`;

		window.location.href = `${getEnv(
			'PROXY_URL'
		)}/auth/hetarchief/login?${queryString.stringify({ returnToUrl })}`;
	}
}

export const authService = new AuthService();

import ky from 'ky-universal';

// TODO: add to env vars
const authUrl =
	'http://localhost:3000/auth/hetarchief/login?returnToUrl=http://localhost:3001/leeszaal/leeszaal-8';

class AuthService {
	public async login() {
		return await ky(authUrl).json();
	}
}

export const authService = new AuthService();

import { Options } from 'ky/distribution/types/options';

import { UserSchema } from '@auth/types';

import { ApiService } from '../api-service';

import { TOS_BASE_URL, USERS_BASE_URL } from './tos.service.const';
import { GetTermsOfServiceResponse } from './tos.service.types';

export class TosService {
	public static async getTos(options: Options = {}): Promise<GetTermsOfServiceResponse> {
		return await ApiService.getApi().get(TOS_BASE_URL, options).json();
	}

	public static async acceptTos(uuid: string, options: Options = {}): Promise<UserSchema> {
		return await ApiService.getApi()
			.put(`${USERS_BASE_URL}/${uuid}/accepted-tos`, {
				...options,
				json: { acceptedTosAt: new Date() },
			})
			.json();
	}
}

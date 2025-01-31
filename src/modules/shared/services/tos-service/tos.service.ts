import type { Options } from 'ky/distribution/types/options';

import type { User } from '@auth/types';

import { ApiService } from '../api-service';

import { TOS_BASE_URL, USERS_BASE_URL } from './tos.service.const';
import type { GetTermsOfServiceResponse } from './tos.service.types';

export namespace TosService {
	export async function getTos(options: Options = {}): Promise<GetTermsOfServiceResponse> {
		return await ApiService.getApi().get(TOS_BASE_URL, options).json();
	}

	export async function acceptTos(uuid: string, options: Options = {}): Promise<User> {
		return await ApiService.getApi()
			.patch(`${USERS_BASE_URL}/${uuid}/accepted-tos`, {
				...options,
				json: { acceptedTosAt: new Date() },
			})
			.json();
	}
}

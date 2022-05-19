import { UserGroupArchief, UserGroupUpdateResponse, UserGroupUpdates } from '@admin/types';
import { ApiService } from '@shared/services/api-service';

import { USER_GROUP_SERVICE_BASE_URL } from './user-groups.const';

export class UserGroupsService {
	public static async getAllUserGroups(): Promise<UserGroupArchief[]> {
		return await ApiService.getApi().get(USER_GROUP_SERVICE_BASE_URL).json();
	}

	public static async updateUserGroups(
		json: UserGroupUpdates
	): Promise<UserGroupUpdateResponse[]> {
		return await ApiService.getApi().patch(USER_GROUP_SERVICE_BASE_URL, { json }).json();
	}
}

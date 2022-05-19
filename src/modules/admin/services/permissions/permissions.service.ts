import { PermissionData } from '@admin/types';
import { ApiService } from '@shared/services/api-service';

import { PERMISSIONS_SERVICE_BASE_URL } from './permissions.const';

export class PermissionsService {
	public static async getAllPermissions(): Promise<PermissionData[]> {
		return await ApiService.getApi().get(PERMISSIONS_SERVICE_BASE_URL).json();
	}
}

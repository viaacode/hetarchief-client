import { GroupName } from '@account/const';
import type { AvoUserCommonUser } from '@viaa/avo2-types';

export const EVENTS_BASE_URL = 'events';

export const mapUserToGroupNameAndKeyUser = (user: AvoUserCommonUser | null): string => {
	if (!user?.userGroup?.name) {
		return GroupName.ANONYMOUS;
	}

	if (!user.isKeyUser) {
		return user.userGroup.name;
	}

	switch (user.userGroup.name) {
		case GroupName.MEEMOO_ADMIN:
			return 'MEEMOO_ADMIN_INTRA_CP';
		case GroupName.CP_ADMIN:
			return 'CP_ADMIN_INTRA_CP';
		default:
			return 'VISITOR_INTRA_CP';
	}
};

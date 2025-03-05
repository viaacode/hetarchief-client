import { VISIT_REQUEST_ID_QUERY_KEY } from '@cp/const/requests.const';
import { ROUTES_BY_LOCALE, ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { NotificationType } from '@shared/services/notifications-service/notifications.types';
import { TranslationService } from '@shared/services/translation-service/translation.service';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';

export const GET_PATH_FROM_NOTIFICATION_TYPE = (): Record<NotificationType, string | null> => {
	const locale = TranslationService.getLocale();
	return {
		[NotificationType.NEW_VISIT_REQUEST]: `${ROUTES_BY_LOCALE[locale].cpAdminVisitRequests}?${VISIT_REQUEST_ID_QUERY_KEY}={visitRequestId}`,
		[NotificationType.VISIT_REQUEST_APPROVED]: `/${ROUTES_BY_LOCALE[locale].visit}#aangevraagde-bezoeken`,
		[NotificationType.VISIT_REQUEST_DENIED]: null,
		[NotificationType.VISIT_REQUEST_CANCELLED]: null,

		// Absolute url, so we force reload the page, so the active visitor spaces are reloaded
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED]: `${window.location.origin}/${ROUTE_PARTS_BY_LOCALE[locale].search}?${IeObjectsSearchFilterField.MAINTAINER_SLUG}={slug}`,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING]: null,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED]:
			ROUTES_BY_LOCALE[locale].accountMyVisitHistory,
		[NotificationType.MAINTENANCE_ALERT]: null,
	};
};

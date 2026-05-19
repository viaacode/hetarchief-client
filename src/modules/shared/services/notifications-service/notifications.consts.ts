import { VISIT_REQUEST_ID_QUERY_KEY } from '@cp/const/requests.const';
import { ROUTE_PARTS_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import {
	type Notification,
	NotificationType,
} from '@shared/services/notifications-service/notifications.types';
import { TranslationService } from '@shared/services/translation-service/translation.service';
import { SearchFilterId } from '@visitor-space/types';

export const GET_PATH_FROM_NOTIFICATION_TYPE = (): Record<NotificationType, string | null> => {
	const locale = TranslationService.getLocale();

	const materialRequestRequesterPath = `${ROUTES_BY_LOCALE[locale].accountMyMaterialRequests}?${QUERY_PARAM_KEY.MATERIAL_REQUEST}={materialRequestId}`;
	const materialRequestCpAdminPath = `${ROUTES_BY_LOCALE[locale].cpAdminMaterialRequests}?${QUERY_PARAM_KEY.MATERIAL_REQUEST}={materialRequestId}`;

	return {
		[NotificationType.MAINTENANCE_ALERT]: null,

		[NotificationType.NEW_VISIT_REQUEST]: `${ROUTES_BY_LOCALE[locale].cpAdminVisitRequests}?${VISIT_REQUEST_ID_QUERY_KEY}={visitRequestId}`,
		[NotificationType.VISIT_REQUEST_APPROVED]: `/${ROUTES_BY_LOCALE[locale].visit}#aangevraagde-bezoeken`,
		[NotificationType.VISIT_REQUEST_DENIED]: null,
		[NotificationType.VISIT_REQUEST_CANCELLED]: null,

		// Absolute url, so we force reload the page, so the active visitor spaces are reloaded
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED]: `${window.location.origin}/${ROUTE_PARTS_BY_LOCALE[locale].search}?${SearchFilterId.Maintainer}={slug}`,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING]: null,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED]:
			ROUTES_BY_LOCALE[locale].accountMyVisitHistory,

		[NotificationType.NEW_MATERIAL_REQUEST]: materialRequestCpAdminPath,
		[NotificationType.MATERIAL_REQUEST_CANCELLED]: materialRequestCpAdminPath,
		[NotificationType.MATERIAL_REQUEST_APPROVED]: materialRequestRequesterPath,
		[NotificationType.MATERIAL_REQUEST_DENIED]: materialRequestRequesterPath,
		[NotificationType.MATERIAL_REQUEST_DOWNLOAD_AVAILABLE]: materialRequestRequesterPath,
		[NotificationType.MATERIAL_REQUEST_DOWNLOAD_ALMOST_EXPIRED]: materialRequestRequesterPath,
		[NotificationType.MATERIAL_REQUEST_DOWNLOAD_EXECUTED]: materialRequestCpAdminPath,
		[NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_SEND]: materialRequestRequesterPath,
		[NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_ACCEPTED]: materialRequestCpAdminPath,
	};
};

export const GET_TITLE_FROM_NOTIFICATION = (
	notification: Notification,
	isMobile: boolean
): string => {
	switch (notification.type) {
		case NotificationType.MAINTENANCE_ALERT:
		case NotificationType.NEW_VISIT_REQUEST:
		case NotificationType.VISIT_REQUEST_APPROVED:
		case NotificationType.VISIT_REQUEST_DENIED:
		case NotificationType.VISIT_REQUEST_CANCELLED:
		case NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED:
		case NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING:
		case NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED:
			return notification.title as string;

		case NotificationType.NEW_MATERIAL_REQUEST:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___er-is-een-nieuwe-materiaalaanvraag-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___er-is-een-nieuwe-materiaalaanvraag'
					);

		case NotificationType.MATERIAL_REQUEST_CANCELLED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___er-is-een-materiaalaanvraag-geannuleerd-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___er-is-een-materiaalaanvraag-geannuleerd'
					);

		case NotificationType.MATERIAL_REQUEST_APPROVED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___jouw-aanvraag-voor-een-digitaal-materiaal-werd-goedgekeurd-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___jouw-aanvraag-voor-een-digitaal-materiaal-werd-goedgekeurd'
					);

		case NotificationType.MATERIAL_REQUEST_DENIED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___jouw-aanvraag-voor-een-digitaal-materiaal-werd-afgekeurd-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___jouw-aanvraag-voor-een-digitaal-materiaal-werd-afgekeurd'
					);

		case NotificationType.MATERIAL_REQUEST_DOWNLOAD_AVAILABLE:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___er-is-digitaal-materiaal-beschikbaar-voor-download-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___er-is-digitaal-materiaal-beschikbaar-voor-download'
					);

		case NotificationType.MATERIAL_REQUEST_DOWNLOAD_ALMOST_EXPIRED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___de-downloadtermijn-van-je-aangevraagde-object-vervalt-binnenkort-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___de-downloadtermijn-van-je-aangevraagde-object-vervalt-binnenkort'
					);

		case NotificationType.MATERIAL_REQUEST_DOWNLOAD_EXECUTED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___jouw-digitaal-materiaal-werd-door-een-aanvrager-gedownload-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___jouw-digitaal-materiaal-werd-door-een-aanvrager-gedownload'
					);

		case NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_SEND:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___er-zijn-bijkomende-gebruiksvoorwaarden-gestuurd-voor-je-aanvraag-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___er-zijn-bijkomende-gebruiksvoorwaarden-gestuurd-voor-je-aanvraag'
					);

		case NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_ACCEPTED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___jouw-bijkomende-gebruiksvoorwaarden-werden-aanvaard-mobiel'
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___jouw-bijkomende-gebruiksvoorwaarden-werden-aanvaard'
					);
	}
};

export const GET_DESCRIPTION_FROM_NOTIFICATION = (
	notification: Notification,
	isMobile: boolean
): string => {
	switch (notification.type) {
		case NotificationType.MAINTENANCE_ALERT:
		case NotificationType.NEW_VISIT_REQUEST:
		case NotificationType.VISIT_REQUEST_APPROVED:
		case NotificationType.VISIT_REQUEST_DENIED:
		case NotificationType.VISIT_REQUEST_CANCELLED:
		case NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED:
		case NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING:
		case NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED:
			return notification.description as string;

		case NotificationType.NEW_MATERIAL_REQUEST:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___name-stuurde-een-aanvraag-in-voor-jouw-digitaal-materiaal-mobiel',
						{
							name: notification.materialRequestRequester,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___name-stuurde-een-aanvraag-in-voor-jouw-digitaal-materiaal',
						{
							name: notification.materialRequestRequester,
						}
					);

		case NotificationType.MATERIAL_REQUEST_CANCELLED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___name-annuleerde-een-materiaalaanvraag-voor-jouw-digitaal-materiaal-mobiel',
						{
							name: notification.materialRequestRequester,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___name-annuleerde-een-materiaalaanvraag-voor-jouw-digitaal-materiaal',
						{
							name: notification.materialRequestRequester,
						}
					);

		case NotificationType.MATERIAL_REQUEST_APPROVED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___maintainer-keurde-jouw-aanvraag-voor-hun-digitaal-materiaal-goed-mobiel',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___maintainer-keurde-jouw-aanvraag-voor-hun-digitaal-materiaal-goed',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					);

		case NotificationType.MATERIAL_REQUEST_DENIED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___maintainer-keurde-jouw-aanvraag-voor-hun-digitaal-materiaal-af-mobiel',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___maintainer-keurde-jouw-aanvraag-voor-hun-digitaal-materiaal-af',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					);

		case NotificationType.MATERIAL_REQUEST_DOWNLOAD_AVAILABLE:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___je-kan-het-digitaal-materiaal-van-maintainer-dat-je-aangevraagd-hebt-nu-downloaden-mobiel',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___je-kan-het-digitaal-materiaal-van-maintainer-dat-je-aangevraagd-hebt-nu-downloaden',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					);

		case NotificationType.MATERIAL_REQUEST_DOWNLOAD_ALMOST_EXPIRED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___je-kan-het-digitaal-materiaal-van-maintainer-dat-je-aangevraagd-hebt-nog-maar-7-dagen-downloaden-vooraleer-het-vervalt-mobiel',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___je-kan-het-digitaal-materiaal-van-maintainer-dat-je-aangevraagd-hebt-nog-maar-7-dagen-downloaden-vooraleer-het-vervalt',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					);

		case NotificationType.MATERIAL_REQUEST_DOWNLOAD_EXECUTED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___name-heeft-n-a-v-een-goedgekeurde-aanvraag-jouw-digitaal-materiaal-gedownload-mobiel',
						{
							name: notification.materialRequestRequester,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___name-heeft-n-a-v-een-goedgekeurde-aanvraag-jouw-digitaal-materiaal-gedownload',
						{
							name: notification.materialRequestRequester,
						}
					);

		case NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_SEND:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___maintainer-legt-voor-jouw-aanvraag-voor-hun-digitaal-materiaal-bijkomende-gebruikersvoorwaarden-op-mobiel',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___maintainer-legt-voor-jouw-aanvraag-voor-hun-digitaal-materiaal-bijkomende-gebruikersvoorwaarden-op',
						{
							maintainer: notification.materialRequestMaintainer,
						}
					);

		case NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_ACCEPTED:
			return isMobile
				? tText(
						'modules/shared/services/notifications-service/notifications___name-aanvaardt-jouw-bijkomende-gebruikersvoorwaarden-voor-een-materiaalaanvraag-voor-jouw-digitaal-materiaal-mobiel',
						{
							name: notification.materialRequestRequester,
						}
					)
				: tText(
						'modules/shared/services/notifications-service/notifications___name-aanvaardt-jouw-bijkomende-gebruikersvoorwaarden-voor-een-materiaalaanvraag-voor-jouw-digitaal-materiaal',
						{
							name: notification.materialRequestRequester,
						}
					);
	}
};

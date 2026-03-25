import {
	type MaterialRequest,
	type MaterialRequestEventType,
	MaterialRequestStatus,
} from '@material-requests/types';
import type { TabProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { MaterialRequestDetailBladeTabs } from './material-request-detail-blade.types';

export const isLatestEventStatus = (
	materialRequest: MaterialRequest,
	status: MaterialRequestEventType
): boolean => {
	return (
		materialRequest.status === MaterialRequestStatus.PENDING &&
		materialRequest.history.length > 0 &&
		materialRequest.history.at(materialRequest.history.length - 1)?.messageType === status
	);
};

/**
 * Tabs
 */

export const MATERIAL_REQUEST_DETAILS_TABS = (
	activeTab: MaterialRequestDetailBladeTabs,
	showConversationAndDocumentsTabs: boolean,
	isMobile: boolean
): TabProps[] => {
	const getTab = (
		id: MaterialRequestDetailBladeTabs,
		label: string,
		icon: IconNamesLight,
		isMobile = false
	): TabProps => {
		if (isMobile) {
			return {
				id,
				label: '',
				icon: <Icon name={icon} aria-hidden />,
				active: id === activeTab,
			};
		}

		return {
			id,
			label,
			active: id === activeTab,
		};
	};

	return [
		getTab(
			MaterialRequestDetailBladeTabs.Information,
			tText('Info aanvraag'),
			IconNamesLight.Info,
			isMobile
		),
		...(showConversationAndDocumentsTabs
			? [
					getTab(
						MaterialRequestDetailBladeTabs.Conversation,
						tText('Conversatie'),
						IconNamesLight.Contact,
						isMobile
					),
					getTab(
						MaterialRequestDetailBladeTabs.Documents,
						tText('Documenten'),
						IconNamesLight.File,
						isMobile
					),
				]
			: []),
	];
};

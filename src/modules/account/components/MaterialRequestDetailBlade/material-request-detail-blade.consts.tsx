import { Badge, type TabProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { MaterialRequestDetailBladeTabs } from './material-request-detail-blade.types';

/**
 * Tabs
 */

export const MATERIAL_REQUEST_DETAILS_TABS = (
	activeTab: MaterialRequestDetailBladeTabs,
	showConversationAndDocumentsTabs: boolean,
	isMobile: boolean,
	unreadCount: number
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
				icon: (
					<>
						<Icon name={icon} aria-hidden />
						{id === MaterialRequestDetailBladeTabs.Conversation && unreadCount > 0 && (
							<Badge text={unreadCount} variants={['error', 'small']} />
						)}
					</>
				),
				active: id === activeTab,
			};
		}

		return {
			id,
			label: (
				<>
					{label}
					{id === MaterialRequestDetailBladeTabs.Conversation && unreadCount > 0 && (
						<Badge text={unreadCount} variants={['error', 'small']} />
					)}
				</>
			),
			active: id === activeTab,
		};
	};

	return [
		getTab(
			MaterialRequestDetailBladeTabs.Information,
			tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___info-aanvraag'
			),
			IconNamesLight.Info,
			isMobile
		),
		...(showConversationAndDocumentsTabs
			? [
					getTab(
						MaterialRequestDetailBladeTabs.Conversation,
						tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___conversatie'
						),
						IconNamesLight.Message,
						isMobile
					),
					getTab(
						MaterialRequestDetailBladeTabs.Documents,
						tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___documenten'
						),
						IconNamesLight.Files,
						isMobile
					),
				]
			: []),
	];
};

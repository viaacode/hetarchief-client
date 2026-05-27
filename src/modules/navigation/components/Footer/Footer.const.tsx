import type { NavigationInfo } from '@navigation/services/navigation-service';
import type { ComponentLink } from '@shared/types';

export const footerLinks = (footerNavigationInfos: NavigationInfo[]): ComponentLink[] => {
	return footerNavigationInfos.map((item) => {
		return {
			label: item.label,
			to: item.contentPath,
			external: item.linkTarget === '_blank',
		};
	});
};

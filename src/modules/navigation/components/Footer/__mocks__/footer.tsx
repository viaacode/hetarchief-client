import { FooterItem } from '@navigation/components/Footer/Footer.types';
import { NavigationInfo } from '@navigation/services/navigation-service';
import { ComponentLink } from '@shared/types';

export const footerTestLinks: ComponentLink[] = [
	{
		label: 'link',
		to: 'https://www.test.com',
		external: true,
	},
	{
		label: 'link',
		to: 'https://www.test.com',
	},
	{
		label: 'link',
		to: 'https://www.test.com',
	},
];

export const footerCenterNavigationItems: NavigationInfo[] = [
	{
		id: '42555c7e-1cf7-4031-bb17-e6ca57eaab64',
		label: 'Gebruikersvoorwaarden',
		placement: 'footer_center',
		description: 'Navigatie balk in de footer gecentreerd',
		linkTarget: null,
		iconName: '',
		position: 1,
		contentType: 'INTERNAL_LINK',
		contentPath: '/gebruiksvoorwaarden',
		tooltip: null,
		updatedAt: '2022-02-21T16:36:06.045845+00:00',
		createdAt: '2022-02-21T16:36:06.045845+00:00',
	},
	{
		id: 'a7f9319f-c8ef-47be-991b-105852573b82',
		label: 'Privacy',
		placement: 'footer_center',
		description: 'Navigatie balk in de footer gecentreerd',
		linkTarget: '_blank',
		iconName: '',
		position: 2,
		contentType: 'EXTERNAL_LINK',
		contentPath: 'https://meemoo.be/nl/privacybeleid',
		tooltip: null,
		updatedAt: '2022-02-21T16:36:21.006163+00:00',
		createdAt: '2022-02-21T16:36:21.006163+00:00',
	},
	{
		id: '7e835b10-f84d-40b9-b058-ab9eeb0399d7',
		label: 'Cookiebeleid',
		placement: 'footer_center',
		description: 'Navigatie balk in de footer gecentreerd',
		linkTarget: '_blank',
		iconName: '',
		position: 3,
		contentType: 'EXTERNAL_LINK',
		contentPath: 'https://meemoo.be/nl/cookiebeleid',
		tooltip: null,
		updatedAt: '2022-02-21T16:36:42.466659+00:00',
		createdAt: '2022-02-21T16:36:42.466659+00:00',
	},
];

export const footerLinks = (footerNavigationInfos: NavigationInfo[]): ComponentLink[] => {
	return footerNavigationInfos.map((item) => {
		return {
			label: item.label,
			to: item.contentPath,
			external: item.linkTarget === '_blank',
		};
	});
};

export const footerLeftItem: FooterItem = {
	label: 'Een initiatief van',
	image: {
		name: 'logo_meemoo.svg',
		alt: 'Meemoo logo',
		width: 104,
		height: 44,
	},
	link: {
		label: '',
		to: 'https://www.test.com',
		external: true,
	},
};

export const footerRightItem: FooterItem = {
	label: 'Gesteund door',
	image: {
		name: 'logo_vlaanderen.png',
		alt: 'Vlaanderen logo',
		width: 89,
		height: 39,
	},
	link: {
		label: '',
		to: 'https://www.test.com',
		external: true,
	},
};

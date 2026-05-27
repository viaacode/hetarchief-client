import type { TabProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { SearchPageMediaType } from '@shared/types/ie-objects';

export const mockTabs: TabProps[] = [
	{
		id: SearchPageMediaType.All,
		label: (
			<>
				<strong className="u-mr-8">Alles</strong>
				<small>(52)</small>
			</>
		),
		ariaLabel: 'Alles',
		active: true,
	},
	{
		id: SearchPageMediaType.Audio,
		label: (
			<>
				<strong className="u-mr-8">Audio</strong>
				<small>(52)</small>
			</>
		),
		ariaLabel: 'Audio',
		icon: <Icon name={IconNamesLight.Audio} aria-hidden />,
	},
	{
		id: SearchPageMediaType.Video,
		label: (
			<>
				<strong className="u-mr-8">Video</strong>
				<small>(0)</small>
			</>
		),
		ariaLabel: 'Video',
		icon: <Icon name={IconNamesLight.Video} aria-hidden />,
	},
	{
		id: 'News',
		label: (
			<>
				<strong className="u-mr-8">Kranten</strong>
				<small>(0)</small>
			</>
		),
		ariaLabel: 'Kranten',
		icon: <Icon name={IconNamesLight.Newspaper} aria-hidden />,
	},
];

export const mockAdminTabs: TabProps[] = [
	{
		id: 'all',
		label: 'Alle',
		ariaLabel: 'Alle',
		active: true,
	},
	{
		id: 'all',
		label: 'Open',
		ariaLabel: 'Open',
	},
	{
		id: 'all',
		label: 'Goedgekeurd',
		ariaLabel: 'Goedgekeurd',
	},
	{
		id: 'all',
		label: 'Geweigerd',
		ariaLabel: 'Geweigerd',
	},
];

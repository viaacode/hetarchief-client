import { Icon } from '@shared/components/Icon';
import { VisitorSpaceMediaType } from '@shared/types';

export const mockTabs = [
	{
		id: VisitorSpaceMediaType.All,
		label: (
			<>
				<strong className="u-mr-8">Alles</strong>
				<small>(52)</small>
			</>
		),
		active: true,
	},
	{
		id: VisitorSpaceMediaType.Audio,
		label: (
			<>
				<strong className="u-mr-8">Audio</strong>
				<small>(52)</small>
			</>
		),
		icon: <Icon name="audio" />,
	},
	{
		id: VisitorSpaceMediaType.Video,
		label: (
			<>
				<strong className="u-mr-8">Video</strong>
				<small>(0)</small>
			</>
		),
		icon: <Icon name="video" />,
	},
	{
		id: 'News',
		label: (
			<>
				<strong className="u-mr-8">Kranten</strong>
				<small>(0)</small>
			</>
		),
		icon: <Icon name="newspaper" />,
	},
];

export const mockAdminTabs = [
	{
		id: 'all',
		label: 'Alle',
		active: true,
	},
	{
		id: 'all',
		label: 'Open',
	},
	{
		id: 'all',
		label: 'Goedgekeurd',
	},
	{
		id: 'all',
		label: 'Geweigerd',
	},
];

import { Icon } from '../../Icon';

export const mockTabs = [
	{
		id: 'all',
		label: (
			<>
				<strong className="u-mr-8">Alles</strong>
				<small>(52)</small>
			</>
		),
		active: true,
	},
	{
		id: 'audio',
		label: (
			<>
				<strong className="u-mr-8">Audio</strong>
				<small>(52)</small>
			</>
		),
		icon: <Icon name="audio" />,
	},
	{
		id: 'video',
		label: (
			<>
				<strong className="u-mr-8">Video</strong>
				<small>(0)</small>
			</>
		),
		icon: <Icon name="video" />,
	},
	{
		id: 'news',
		label: (
			<>
				<strong className="u-mr-8">Kranten</strong>
				<small>(0)</small>
			</>
		),
		icon: <Icon name="newspaper" />,
	},
];

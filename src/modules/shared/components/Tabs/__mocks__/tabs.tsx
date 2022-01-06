import { Icon } from '../../Icon';

export const mockTabs = [
	{
		id: 'all',
		label: (
			<>
				<strong className="u-mr-8">Alles</strong>
				<small>(52)</small>
			</>
		) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: remove any once Tab type supports ReactNode
	},
	{
		id: 'audio',
		label: (
			<>
				<strong className="u-mr-8">Audio</strong>
				<small>(52)</small>
			</>
		) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: remove any once Tab type supports ReactNode
		icon: <Icon name="audio" />,
	},
	{
		id: 'video',
		label: (
			<>
				<strong className="u-mr-8">Video</strong>
				<small>(0)</small>
			</>
		) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: remove any once Tab type supports ReactNode
		icon: <Icon name="video" />,
	},
];

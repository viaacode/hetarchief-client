import { MediaCardListProps } from '../MediaCardList.types';

import { MediaCardProps } from '@shared/components';

export const mock = async (args: Pick<MediaCardProps, 'view'>): Promise<MediaCardListProps> => {
	const items: MediaCardProps[] = await fetch(
		'https://jsonplaceholder.typicode.com/photos?_start=0&_limit=25'
	)
		.then((response) => response.json())
		.then((data: Array<{ id: number; title: string; url: string }>) => {
			return data.map((item, i) => {
				const type = Math.floor(Math.random() * 2) == 0;
				const preview = Math.floor(Math.random() * 2) == 0;

				const start = new Date();
				const end = new Date(1990, 0, 1);

				return {
					title: `#${i + 1} - ${item.title}`,
					description: Array(20)
						.join(` ${item.title}`)
						.split(' ')
						.sort(function () {
							return 0.5 - Math.random();
						})
						.join(' '),
					published_at: new Date(
						start.getTime() + Math.random() * (end.getTime() - start.getTime())
					),
					published_by: item.title.split(' ')[0] || 'Somebody',
					type: type ? 'audio' : 'video',
					preview: preview ? item.url.replace('/600/', '/496x322/') : undefined,
					view: args.view,
				};
			});
		});

	return {
		items,
		view: args.view,
	};
};

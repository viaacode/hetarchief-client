import {
	getIconFromObjectType,
	type IdentifiableMediaCard,
	type MediaCardProps,
} from '@shared/components/MediaCard';
import { IeObjectType } from '@shared/types/ie-objects';
import { shuffle } from 'lodash-es';
import type { MediaCardListProps } from '../MediaCardList.types';

export const mock = async (
	args: Pick<MediaCardProps, 'view'>,
	start = 0,
	limit = 24
): Promise<MediaCardListProps> => {
	const items: IdentifiableMediaCard[] = await fetch(
		`https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=${limit}`
	)
		.then((response) => response.json())
		.then((json: unknown) => {
			const data = json as Array<{ id: number; title: string; url: string }>;

			return data.map((item, i): IdentifiableMediaCard => {
				const preview = Math.floor(Math.random() * 2) === 0;

				const start = new Date();
				const end = new Date(1990, 0, 1);

				const type = shuffle(Object.values(IeObjectType))[0];
				return {
					// Capitalize title
					title: `#${i + 1} - ${item.title?.charAt(0).toUpperCase() + item.title?.slice(1)}`,
					description: Array(20)
						.join(` ${item.title}`)
						.split(' ')
						.sort(() => 0.5 - Math.random())
						.join(' '),
					publishedOrCreatedDate: new Date(
						start.getTime() + Math.random() * (end.getTime() - start.getTime())
					).toDateString(),
					publishedBy: item.title.split(' ')[0] || 'Somebody',
					type,
					icon: getIconFromObjectType(type, preview),
					thumbnail: preview ? item.url.replace('/600/', '/496x322/') : undefined,
					view: args.view,
					maintainerSlug: 'vrt',
					schemaIdentifier: 'or-3i32difh',
					link: undefined,
				};
			});
		});

	return {
		items,
		view: args.view,
	};
};

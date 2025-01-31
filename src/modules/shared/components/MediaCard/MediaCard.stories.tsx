import type { ComponentMeta, ComponentStory } from '@storybook/react';
import type { CSSProperties } from 'react';

import { IeObjectType } from '@shared/types/ie-objects';

import MediaCard from './MediaCard';
import { soundwave, thumbnail } from './__mocks__/media-card';

export default {
	title: 'Components/MediaCard',
	component: MediaCard,
} as ComponentMeta<typeof MediaCard>;

const container: CSSProperties = {
	display: 'flex',
	margin: '-10px',
};
const column: CSSProperties = { flex: '1 1 0', margin: '10px' };

const Template: ComponentStory<typeof MediaCard> = (args) => {
	return (
		<section
			style={{
				...container,
				flexDirection: args.view === 'grid' ? 'row' : 'column',
			}}
		>
			<div style={column}>
				<MediaCard
					{...args}
					title="Something you can hear"
					type={IeObjectType.Audio}
					thumbnail={soundwave}
				/>
			</div>
			<div style={column}>
				<MediaCard
					{...args}
					title="Something you can watch"
					type={IeObjectType.Video}
					thumbnail={thumbnail}
				/>
			</div>
			<div style={column}>
				<MediaCard
					{...args}
					title="Something you can hear very little about"
					type={IeObjectType.Audio}
				/>
			</div>
			<div style={column}>
				<MediaCard
					{...args}
					title="Something you can read about"
					type={IeObjectType.Newspaper}
				/>
			</div>
			<div style={column}>
				<MediaCard
					{...args}
					title="Something you can see nothing of"
					type={IeObjectType.Video}
				/>
			</div>
		</section>
	);
};

export const Grid: ComponentStory<typeof MediaCard> = Template.bind({});
Grid.args = {
	view: 'grid',
	publishedOrCreatedDate: new Date().toDateString(),
	publishedBy: 'Studio Hyperdrive',
	description:
		'Donec nunc odio, fermentum vel laoreet at, luctus lobortis mauris. Nullam metus lectus, semper vitae nisi in, mollis porttitor nisi. Vivamus pharetra accumsan congue. Aenean commodo leo felis, a placerat velit facilisis non. Proin sollicitudin ultrices mi in viverra. Nam gravida, neque vel porttitor malesuada, velit mi placerat sapien, in fermentum ante neque vitae odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec imperdiet nibh in nisi sagittis, et fermentum turpis dictum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla sollicitudin ipsum eget fermentum iaculis. Nunc facilisis nibh orci, eget euismod lacus suscipit et. Maecenas et tellus consectetur, ornare elit vitae, ullamcorper dolor. Proin vel semper quam. Quisque consequat orci nec semper facilisis. ',
};

export const List: ComponentStory<typeof MediaCard> = Template.bind({});
List.args = {
	...Grid.args,
	view: 'list',
	publishedBy: '',
};

import { metadataMock } from '@media/components/Metadata/__mocks__/metadata';
import { MediaInfo } from '@media/types';

export const mapMetadata = (media: MediaInfo) => {
	return [...metadataMock.metadata];
};

// [
// 	...metadataMock.metadata,
// 	{
// 		title: 'Trefwoorden',
// 		data: (
// 			<TagList
// 				className="u-pt-12"
// 				tags={tags}
// 				onTagClicked={(id) => {
// 					router.push(
// 						stringifyUrl({
// 							url: `/leeszaal/${router.query.readingRoomSlug}`,
// 							query: {
// 								search: id,
// 							},
// 						})
// 					);
// 				}}
// 				variants={['clickable', 'silver', 'medium']}
// 			/>
// 		),
// 	},
// ]

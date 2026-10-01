import { IeObjectCardList } from '@ie-objects/components/IeObjectCardList/IeObjectCardList';
import Metadata from '@ie-objects/components/Metadata/Metadata';
import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import { tText } from '@shared/helpers/translate';
import type { FC } from 'react';
import type { ObjectDetailPageRelatedTabProps } from './ObjectDetailPageRelatedTab.types';

export const ObjectDetailPageRelatedTab: FC<ObjectDetailPageRelatedTabProps> = ({
	items,
	isParent,
}) => {
	const title = isParent
		? tText('modules/ie-objects/object-detail-page___dit-object-is-onderdeel-van-dit-hoofdobject')
		: items.length === 1
			? tText('modules/ie-objects/object-detail-page___dit-object-heeft-1-gerelateerd-object')
			: tText(
					'modules/ie-objects/object-detail-page___dit-object-heeft-amount-gerelateerde-objecten',
					{ amount: items.length }
				);

	return (
		<MetadataList allowTwoColumns={false}>
			<Metadata title={title} key="metadata-related" className="u-pb-0">
				<IeObjectCardList type="related" items={items} />
			</Metadata>
		</MetadataList>
	);
};

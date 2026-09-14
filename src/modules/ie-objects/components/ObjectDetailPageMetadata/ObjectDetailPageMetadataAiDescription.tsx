import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import MetaDataFieldWithHighlightingAndMaxLength from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength';
import { AI_METADATA_FIELD_MAX_LENGTH } from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength.const';
import { tHtml, tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import styles from './ObjectDetailPageMetadataAiDescription.module.scss';
import { ObjectDetailPageMetadataDisclaimerTooltip } from './ObjectDetailPageMetadataDisclaimerTooltip';

export interface ObjectDetailPageMetadataAiDescriptionProps {
	name: string;
	synopsis: string;
	onReadMoreClicked: (item: MetadataItem) => void;
	className?: string;
}

export function ObjectDetailPageMetadataAiDescription({
	name,
	synopsis,
	onReadMoreClicked,
	className,
}: ObjectDetailPageMetadataAiDescriptionProps) {
	return (
		<div className={clsx(styles['c-object-detail-page-metadata-ai-description'], className)}>
			<div className={styles['c-object-detail-page-metadata-ai-description__header']}>
				<h2 className={styles['c-object-detail-page-metadata-ai-description__title']}>{name}</h2>

				<ObjectDetailPageMetadataDisclaimerTooltip
					iconName={IconNamesLight.Ai}
					position="top-end"
					className={styles['c-object-detail-page-metadata-ai-description__disclaimer']}
					ariaLabel={tText(
						'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___meer-info-over-ai-gegenereerde-titel-en-samenvatting'
					)}
					content={tHtml(
						'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___deze-titel-en-samenvatting-zijn-automatisch-gegenereerd-met-ai-en-kunnen-fouten-bevatten-meer-info'
					)}
				/>
			</div>

			<MetaDataFieldWithHighlightingAndMaxLength
				title={tText(
					'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___samenvatting-ai'
				)}
				data={synopsis}
				maxLength={AI_METADATA_FIELD_MAX_LENGTH}
				className="u-line-height-1-4 u-font-size-14"
				onReadMoreClicked={onReadMoreClicked}
			/>
		</div>
	);
}

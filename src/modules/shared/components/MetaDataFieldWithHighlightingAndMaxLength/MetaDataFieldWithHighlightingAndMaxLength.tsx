import { isString } from 'lodash-es';
import { FC, ReactNode } from 'react';

import { MetadataItem } from '@ie-objects/components';
import HighlightedMetadata from '@shared/components/HighlightedMetadata/HighlightedMetadata';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultComponentProps } from '@shared/types';

import { METADATA_FIELD_MAX_LENGTH } from './MetaDataFieldWithHighlightingAndMaxLength.const';
import styles from './MetaDataFieldWithHighlightingAndMaxLength.module.scss';

interface MetaDataFieldWithHighlightingAndMaxLengthProps extends DefaultComponentProps {
	title: string | ReactNode;
	data: string;
	onReadMoreClicked: (item: MetadataItem) => void;
}

const MetaDataFieldWithHighlightingAndMaxLength: FC<
	MetaDataFieldWithHighlightingAndMaxLengthProps
> = ({ title, data, className, onReadMoreClicked }) => {
	const { tText } = useTranslation();

	const isLongFieldData: boolean = isString(data) && data.length > METADATA_FIELD_MAX_LENGTH;

	const parsedFieldData: string | ReactNode = isLongFieldData
		? (data as string).substring(0, METADATA_FIELD_MAX_LENGTH) + '...'
		: data;

	return (
		<>
			<div className={className}>
				{/* ARC-1282: if there are issues with showing \\n or not showing new lines,
				the parsedDescription used to be in a <TextWithNewLines /> component. This component was removed here to highlight text */}
				<HighlightedMetadata title={title} data={parsedFieldData} />

				{isLongFieldData && (
					<div
						className={styles['c-metadata__field__blade__read-more']}
						onClick={() => onReadMoreClicked({ title, data })}
					>
						{tText('modules/visitor-space/utils/metadata/metadata___lees-meer')}
					</div>
				)}
			</div>
		</>
	);
};

export default MetaDataFieldWithHighlightingAndMaxLength;

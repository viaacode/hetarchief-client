import clsx from 'clsx';
import { isString } from 'lodash-es';
import { FC, ReactNode } from 'react';
import Highlighter from 'react-highlight-words';
import { useQueryParams } from 'use-query-params';

import { MetadataItem } from '@ie-objects/components';
import { IE_OBJECT_QUERY_PARAM_CONFIG } from '@ie-objects/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultComponentProps } from '@shared/types';

import { METADATA_FIELD_MAX_LENGTH } from './MetaDataFieldWithHighlightingAndMaxLength.const';
import styles from './MetaDataFieldWithHighlightingAndMaxLength.module.scss';

interface MetaDataFieldWithHighlightingAndMaxLengthProps extends DefaultComponentProps {
	title: string | ReactNode;
	data: string;
	onReadMoreClicked: (item: MetadataItem) => void;
}

const MetaDataFieldWithHighlightingAndMaxLength: FC<MetaDataFieldWithHighlightingAndMaxLengthProps> =
	({ title, data, className, onReadMoreClicked }) => {
		const { tText } = useTranslation();
		const [query] = useQueryParams(IE_OBJECT_QUERY_PARAM_CONFIG);

		const isLongFieldData: boolean = isString(data) && data.length > METADATA_FIELD_MAX_LENGTH;

		const parsedFieldData: string | ReactNode = isLongFieldData
			? (data as string).substring(0, METADATA_FIELD_MAX_LENGTH) + '...'
			: data;

		const highlighted = (toHighlight: string) => (
			<Highlighter
				searchWords={(query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS] as string[]) ?? []}
				autoEscape={true}
				textToHighlight={toHighlight}
			/>
		);

		const renderHighlighted = (): ReactNode => {
			if (isString(parsedFieldData)) {
				// Split text on new lines and highlight each part separately + put each part in its own paragraph to show new lines
				return parsedFieldData
					.split(/(\\\\r|\\r)?\\\\n|\\n/)
					.map((fieldTextPart, fieldTextPartIndex) => (
						<span key={title + '-' + fieldTextPartIndex}>
							{highlighted(fieldTextPart)}
						</span>
					));
			} else {
				return parsedFieldData;
			}
		};

		return (
			<>
				<p className={clsx(className, 'u-line-height-1-6 u-font-size-16')}>
					{/* ARC-1282: if there are issues with showing \\n or not showing new lines,
				the parsedDescription used to be in a <TextWithNewLines /> component. This component was removed here to highlight text */}
					{renderHighlighted()}

					{isLongFieldData && (
						<p
							className={styles['c-metadata__field__blade__read-more']}
							onClick={() => onReadMoreClicked({ title, data })}
						>
							{tText('modules/visitor-space/utils/metadata/metadata___lees-meer')}
						</p>
					)}
				</p>
			</>
		);
	};

export default MetaDataFieldWithHighlightingAndMaxLength;

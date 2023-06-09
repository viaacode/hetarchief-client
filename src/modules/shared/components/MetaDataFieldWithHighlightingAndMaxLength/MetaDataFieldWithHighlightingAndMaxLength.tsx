import clsx from 'clsx';
import { isString } from 'lodash-es';
import { FC, ReactNode, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useQueryParams } from 'use-query-params';

import { IE_OBJECT_QUERY_PARAM_CONFIG } from '@ie-objects/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { Blade } from '../Blade';

import { METADATA_FIELD_MAX_LENGTH } from './MetaDataFieldWithHighlightingAndMaxLength.const';
import styles from './MetaDataFieldWithHighlightingAndMaxLength.module.scss';

interface MetaDataFieldWithHighlightingAndMaxLengthProps {
	title: string | ReactNode;
	data: string;
}

const MetaDataFieldWithHighlightingAndMaxLength: FC<MetaDataFieldWithHighlightingAndMaxLengthProps> =
	({ title, data }) => {
		const { tText } = useTranslation();
		const [query] = useQueryParams(IE_OBJECT_QUERY_PARAM_CONFIG);

		const [isBladeOpen, setIsBladeOpen] = useState(false);

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
				return highlighted(parsedFieldData.replaceAll('\\n', ' ').replaceAll('\n', ' '));
			} else {
				return parsedFieldData;
			}
		};

		return (
			<>
				<p className="u-pb-24 u-line-height-1-4 u-font-size-14">
					{/* ARC-1282: if there are issues with showing \\n or not showing new lines,
				the parsedDescription used to be in a <TextWithNewLines /> component. This component was removed here to highlight text */}
					{renderHighlighted()}

					{isLongFieldData && (
						<p
							className={styles['c-metadata__field__blade__read-more']}
							onClick={() => setIsBladeOpen(true)}
						>
							{tText('modules/visitor-space/utils/metadata/metadata___lees-meer')}
						</p>
					)}
				</p>
				<Blade
					className={clsx(
						styles['c-metadata__field__blade'],
						'u-pb-24 u-line-height-1-4 u-font-size-14'
					)}
					isOpen={isBladeOpen}
					onClose={() => setIsBladeOpen(false)}
					renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
						<h2 {...props}>{title}</h2>
					)}
				>
					<div className="u-px-32 u-pb-32">{highlighted(data)}</div>
				</Blade>
			</>
		);
	};

export default MetaDataFieldWithHighlightingAndMaxLength;

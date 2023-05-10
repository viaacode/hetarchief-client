import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useQueryParams } from 'use-query-params';

import { IE_OBJECT_QUERY_PARAM_CONFIG } from '@ie-objects/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { Blade } from '../Blade';

import { DESCRIPTION_MAX_LENGTH } from './MetaDataDescription.const';
import styles from './MetaDataDescription.module.scss';

interface MetaDataDescriptionProps {
	description: string;
}

const MetaDataDescription: FC<MetaDataDescriptionProps> = ({ description }) => {
	const { tText } = useTranslation();
	const isLongDescription: boolean = useMemo(
		() => description.length > DESCRIPTION_MAX_LENGTH,
		[description]
	);
	const parsedDescription = isLongDescription
		? description.substring(0, DESCRIPTION_MAX_LENGTH)
		: description;
	const [isBladeOpen, setIsBladeOpen] = useState(false);

	const renderBladeTitle = () => (
		<h3 className={styles['c-metadatadescription__title']}>
			{tText('modules/visitor-space/utils/metadata/metadata___beschrijving')}
		</h3>
	);

	const [query] = useQueryParams(IE_OBJECT_QUERY_PARAM_CONFIG);

	const highlighted = (toHighlight: string) => (
		<Highlighter
			searchWords={(query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS] as string[]) ?? []}
			autoEscape={true}
			textToHighlight={toHighlight}
		/>
	);

	return (
		<>
			<p className="u-pb-24 u-line-height-1-4 u-font-size-14">
				{/* ARC-1282: if there are issues with showing \\n or not showing new lines,
				the parsedDescription used to be in a <TextWithNewLines /> component. This component was removed here to highlight text */}
				{highlighted(parsedDescription.replaceAll('\\n', ' ').replaceAll('\n', ' '))}
				{isLongDescription && (
					<u
						className={styles['c-metadatadescription__read-more']}
						onClick={() => setIsBladeOpen(true)}
					>
						{tText('modules/visitor-space/utils/metadata/metadata___lees-meer')}
					</u>
				)}
			</p>
			<Blade
				className={clsx(
					styles['c-metadatadescription'],
					'u-pb-24 u-line-height-1-4 u-font-size-14'
				)}
				isOpen={isBladeOpen}
				onClose={() => setIsBladeOpen(false)}
				renderTitle={renderBladeTitle}
			>
				{highlighted(description)}
			</Blade>
		</>
	);
};

export default MetaDataDescription;

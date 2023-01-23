import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';

import { Blade } from '../Blade';
import { TextWithNewLines } from '../TextWithNewLines';

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

	return (
		<>
			<p className="u-pb-24 u-line-height-1-4 u-font-size-14">
				<TextWithNewLines text={parsedDescription} />
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
				{description}
			</Blade>
		</>
	);
};

export default MetaDataDescription;

import clsx from 'clsx';
import { FC, useState } from 'react';

import useTranslation from '@shared/hooks/use-translation/use-translation';

import { Blade } from '../Blade';
import { TextWithNewLines } from '../TextWithNewLines';

import styles from './MetaDataDescription.module.scss';

interface MetaDataDescriptionProps {
	description: string;
}

const MetaDataDescription: FC<MetaDataDescriptionProps> = ({ description }) => {
	const { tText } = useTranslation();
	const maxLength = 500;
	const isDescriptionLong = description.length > maxLength;
	const shortenedDescription = description.substring(0, maxLength);
	const [isBladeOpen, setIsBladeOpen] = useState(false);

	return (
		<>
			<p className="u-pb-24 u-line-height-1-4 u-font-size-14">
				<TextWithNewLines text={isDescriptionLong ? shortenedDescription : description} />
				{isDescriptionLong && (
					<u style={{ cursor: 'pointer' }} onClick={() => setIsBladeOpen(true)}>
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
				renderTitle={() => (
					<h3 className={styles['c-metadatadescription__title']}>
						{tText('modules/visitor-space/utils/metadata/metadata___beschrijving')}
					</h3>
				)}
			>
				{description}
			</Blade>
		</>
	);
};

export default MetaDataDescription;

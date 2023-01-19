import clsx from 'clsx';
import { FC, useState } from 'react';

import { Blade } from '../Blade';
import { TextWithNewLines } from '../TextWithNewLines';

import styles from './MetaDataDescription.module.scss';

interface MetaDataDescriptionProps {
	description: string;
}

const MetaDataDescription: FC<MetaDataDescriptionProps> = ({ description }) => {
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
						Lees meer...
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
					<h3 className={styles['c-metadatadescription__title']}>Beschrijving</h3>
				)}
			>
				{description}
			</Blade>
		</>
	);
};

export default MetaDataDescription;

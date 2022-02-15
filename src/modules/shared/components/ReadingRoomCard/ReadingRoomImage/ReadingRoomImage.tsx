import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';

import styles from './ReadingRoomImage.module.scss';
import { ReadingRoomImageProps } from './ReadingRoomImage.types';

const ReadingRoomImage: FC<ReadingRoomImageProps> = ({
	className,
	color,
	image,
	name,
	logo,
	variant,
}) => {
	const rootCls = clsx(
		className,
		styles['c-reading-room-image'],
		variant && styles[`c-reading-room-image--${variant}`]
	);
	const rootStyle = color ? { backgroundColor: color } : {};

	return (
		<div className={rootCls} style={rootStyle}>
			{image && (
				<div className={styles['c-reading-room-image__background']}>
					<Image src={image} alt={name} layout="fill" objectFit="cover" />
				</div>
			)}

			{logo && (
				<div className={styles['c-reading-room-image__logo']}>
					<Image src={logo} alt={name} layout="fill" objectFit="contain" />
				</div>
			)}
		</div>
	);
};

export default ReadingRoomImage;

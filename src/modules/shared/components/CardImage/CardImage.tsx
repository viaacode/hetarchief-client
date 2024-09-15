import clsx from 'clsx';
import Image from 'next/legacy/image';
import React, { type FC } from 'react';

import styles from './CardImage.module.scss';
import { type CardImageProps } from './CardImage.types';

const CardImage: FC<CardImageProps> = ({
	color,
	image,
	logo,
	name,
	id,
	size,
	shadow,
	style,
	className,
	unoptimized = false,
}) => {
	color = color || '#009690'; // Set default, accounting for `null`

	return (
		<div
			className={clsx(
				className,
				styles['c-card-image__background'],
				size && styles[`c-card-image__background--${size}`],
				shadow && styles['c-card-image__background--shadow']
			)}
			style={{
				...style,
				...(color ? { backgroundColor: color } : {}),
			}}
		>
			{image && (
				<div className={styles['c-card-image__background--image']}>
					<Image
						unoptimized={unoptimized}
						src={image}
						alt={name || id || 'background'}
						layout="fill"
						objectFit="cover"
					/>
				</div>
			)}

			{logo && (
				<div className={styles['c-card-image__logo']}>
					<Image
						unoptimized={unoptimized}
						className={styles['c-card-image__logo-image']}
						src={logo}
						alt={name || id || 'logo'}
						layout="fill"
						objectFit="contain"
					/>
				</div>
			)}
		</div>
	);
};

export default CardImage;

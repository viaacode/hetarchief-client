import clsx from 'clsx';
import Image from 'next/image';
import React, { FC } from 'react';

import styles from './CardImage.module.scss';
import { CardImageProps } from './CardImage.types';

const CardImage: FC<CardImageProps> = ({
	color = '#009690',
	image,
	logo,
	name,
	id,
	size,
	style,
}) => {
	return (
		<div
			className={clsx(
				styles['c-card-image__background'],
				size && styles[`c-card-image__background--${size}`]
			)}
			style={{
				...style,
				backgroundColor: color,
			}}
		>
			{image && (
				<div className={styles['c-card-image__background--image']}>
					<Image
						src={image}
						alt={name || id.toString()}
						layout="fill"
						objectFit="cover"
					/>
				</div>
			)}

			{logo && (
				<div className={styles['c-card-image__logo']}>
					<Image
						className={styles['c-card-image__logo-image']}
						src={logo || ''}
						alt={name || id.toString()}
						layout="fill"
						objectFit="contain"
					/>
				</div>
			)}
		</div>
	);
};

export default CardImage;

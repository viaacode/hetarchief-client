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
	shadow,
	style,
	className,
	unoptimized = false,
}) => {
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
						alt={name || id.toString()}
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

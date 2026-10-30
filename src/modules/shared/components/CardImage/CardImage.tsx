import { useOptimizedImage } from '@shared/hooks/use-optimized-image';
import clsx from 'clsx';
import Image from 'next/image';
import React, { type FC } from 'react';

import styles from './CardImage.module.scss';
import type { CardImageProps } from './CardImage.types';

// Display widths in css pixels, the cards are at most ~480px wide
const CARD_IMAGE_WIDTH = 960;
const CARD_LOGO_WIDTH = 320;

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
}) => {
	color = color || '#009690'; // Set default, accounting for `null`
	const [imageSrc, onImageError] = useOptimizedImage(image, CARD_IMAGE_WIDTH);
	const [logoSrc, onLogoError] = useOptimizedImage(logo, CARD_LOGO_WIDTH);

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
			{imageSrc && (
				<div className={styles['c-card-image__background--image']}>
					<Image
						src={imageSrc}
						onError={onImageError}
						alt={name || id || 'background'}
						fill
						sizes="100vw"
						style={{
							objectFit: 'cover',
						}}
					/>
				</div>
			)}

			{logoSrc && (
				<div className={styles['c-card-image__logo']}>
					<Image
						className={styles['c-card-image__logo-image']}
						src={logoSrc}
						onError={onLogoError}
						alt={name || id || 'logo'}
						fill
						sizes="100vw"
						style={{
							objectFit: 'contain',
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default CardImage;

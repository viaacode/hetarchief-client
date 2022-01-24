import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import styles from './Hero.module.scss';
import { HeroProps } from './Hero.types';

const Hero: FC<HeroProps> = ({ title, description, link, image }) => {
	return (
		<header className={styles['c-hero']}>
			<div className={styles['c-hero__image']}>
				<Image src={image.src} layout="fill" alt={image.alt} objectFit="contain" />
			</div>
			<div className={styles['c-hero__content']}>
				<h1 className={styles['c-hero__title']}>{title}</h1>
				<p className={styles['c-hero__description']}>{description}</p>
				<b>
					<Link href={link.to}>
						<a
							className={styles['c-hero__link']}
							target={link.external ? '_blank' : '_self'}
						>
							{link.label}
						</a>
					</Link>
				</b>
			</div>
		</header>
	);
};

export default Hero;

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import styles from './ErrorPage.module.scss';
import { ErrorPageProps } from './ErrorPage.types';

const ErrorPage: FC<ErrorPageProps> = ({ className, title, description, link, image }) => {
	const rootCls = clsx(className, styles['c-error-page']);
	return (
		<section className={rootCls}>
			{image && (
				<div className={styles['c-error-page__image-background']}>
					{title && <h1 className={styles['c-error-page__title']}>{title}</h1>}
					<div className={styles['c-error-page__image-wrapper']}>
						<Image
							src={image.image}
							alt=""
							layout="fill"
							objectPosition={image.left ? 'left' : undefined}
						/>
					</div>
				</div>
			)}
			<div className={styles['c-error-page__info']}>
				{description && (
					<p className={styles['c-error-page__description']}>{description}</p>
				)}
				{link && (
					<Link href={link.to} passHref={true}>
						<div className={styles['c-error-page__button']}>{link.component}</div>
					</Link>
				)}
			</div>
		</section>
	);
};

export default ErrorPage;

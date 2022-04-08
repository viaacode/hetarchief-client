import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';

import styles from './ErrorPage.module.scss';
import { ErrorPageProps } from './ErrorPage.types';

const ErrorPage: FC<ErrorPageProps> = ({ className, title, description, button, image }) => {
	const rootCls = clsx(className, styles['c-error-page']);
	return (
		<section className={rootCls}>
			{title && <h1 className={styles['c-error-page__title']}>{title}</h1>}
			{image && (
				<div className={styles['c-error-page__image-wrapper']}>
					<Image src={image} alt="" layout="fill" objectFit="cover" />
				</div>
			)}
			{description && <p className={styles['c-error-page__description']}>{description}</p>}
			{button && <div className={styles['c-error-page__button']}>{button}</div>}
		</section>
	);
};

export default ErrorPage;

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import styles from './ErrorPage.module.scss';
import { ErrorPageProps } from './ErrorPage.types';

const ErrorPage: FC<ErrorPageProps> = ({
	className,
	title,
	description,
	link,
	image,
	buttonsComponent,
}) => {
	useStickyLayout(false);
	const { tText } = useTranslation();

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
				{buttonsComponent && (
					<div className={styles['c-error-page__button-component']}>
						{buttonsComponent}
					</div>
				)}

				{link && (
					<Link href={link.to} passHref>
						<a
							className={styles['c-error-page__button']}
							aria-label={tText(
								'modules/shared/components/error-page/error-page___navigeer-naar-een-veilige-pagina'
							)}
						>
							{link.component}
						</a>
					</Link>
				)}
			</div>
		</section>
	);
};

export default ErrorPage;

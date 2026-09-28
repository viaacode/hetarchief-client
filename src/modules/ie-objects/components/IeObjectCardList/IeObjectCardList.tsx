import { RelatedObject } from '@ie-objects/components/RelatedObject';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import styles from './IeObjectCardList.module.scss';
import type { IeObjectCardListProps } from './IeObjectCardList.types';

export const IeObjectCardList: FC<IeObjectCardListProps> = ({ type, items, className }) => {
	const router = useRouter();
	const locale = useLocale();

	if (!items.length) {
		return null;
	}

	return (
		<ul
			className={clsx(
				'u-bg-platinum',
				'u-list-reset',
				styles['c-ie-object-card-list'],
				styles[`c-ie-object-card-list--${type}`],
				className,
				// Plain (unscoped) class, not run through CSS modules: lets
				// ObjectDetailPage.module.scss's `:has()` selector on the scroll container detect
				// "similar" content from outside this component without depending on this file's
				// hashed class names.
				`p-object-detail__metadata-list--${type}`
			)}
		>
			{items.map((item, index) => (
				<li key={`${type}-object-${item.id}-${index}`}>
					<Link
						passHref
						href={`${ROUTES_BY_LOCALE[locale].search}/${router.query.slug}/${item.id}`}
						className={clsx(styles['c-ie-object-card-list__link'], 'u-text-no-decoration')}
						aria-label={item.title}
					>
						<RelatedObject object={item} />
					</Link>
				</li>
			))}
		</ul>
	);
};

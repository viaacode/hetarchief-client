import Metadata from '@ie-objects/components/Metadata/Metadata';
import type { IeObjectTheme } from '@ie-objects/ie-objects.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { Locale } from '@shared/utils/i18n';
import { getThemeSearchPath } from '@visitor-space/utils/theme-search-path';
import clsx from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './ObjectDetailPageMetadataThemes.module.scss';

export interface ObjectDetailPageMetadataThemesProps {
	title: ReactNode;
	themes: IeObjectTheme[];
	locale: Locale;
	className?: string;
}

/**
 * The "Thema's" section of the metadata panel on an object detail page. See ARC-3826.
 *
 * Themes arrive sorted by linked object count descending. Per theme we show its name, linking to
 * the theme detail page when one is configured, and the number of objects that carry the theme.
 */
export function ObjectDetailPageMetadataThemes({
	title,
	themes,
	locale,
	className,
}: ObjectDetailPageMetadataThemesProps) {
	const renderThemeName = (theme: IeObjectTheme) => {
		const name = locale === Locale.en ? theme.nameEn : theme.nameNl;
		const path = locale === Locale.en ? theme.contentPagePathEn : theme.contentPagePathNl;

		// Without a theme detail page there is nothing to link to, so the name stays plain text
		if (!path) {
			return <span className={styles['c-object-detail-page-metadata-themes__name']}>{name}</span>;
		}

		return (
			<Link
				href={path}
				className={clsx(
					styles['c-object-detail-page-metadata-themes__name'],
					styles['c-object-detail-page-metadata-themes__name--link']
				)}
			>
				{name}
			</Link>
		);
	};

	return (
		<Metadata title={title} className={className} key="metadata-themes">
			<ul className={styles['c-object-detail-page-metadata-themes__list']}>
				{themes.map((theme) => (
					<li key={theme.id} className={styles['c-object-detail-page-metadata-themes__item']}>
						{renderThemeName(theme)}
						<Link
							href={getThemeSearchPath(locale, theme.slug)}
							className={styles['c-object-detail-page-metadata-themes__count']}
						>
							<Icon
								className={styles['c-object-detail-page-metadata-themes__count-icon']}
								name={IconNamesLight.RelatedObjects}
								aria-hidden
							/>
							{/* The bare number carries no meaning on its own, so screen readers get the
							     spelled-out label instead */}
							<span
								className={styles['c-object-detail-page-metadata-themes__count-number']}
								aria-hidden
							>
								{theme.ieObjectCount}
							</span>
							<span className={styles['c-object-detail-page-metadata-themes__count-label']}>
								{tText(
									'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata-themes___aantal-objecten-in-dit-thema',
									{ count: theme.ieObjectCount }
								)}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</Metadata>
	);
}

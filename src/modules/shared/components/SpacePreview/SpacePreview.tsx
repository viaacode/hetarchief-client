import clsx from 'clsx';
import { FC } from 'react';

import { SpacePreviewProps } from '@shared/components';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { Locale } from '@shared/utils';

import { CardImage } from '../CardImage';
import Html from '../Html/Html';

import styles from './SpacePreview.module.scss';

const SpacePreview: FC<SpacePreviewProps> = ({
	className,
	visitorSpace: { id, image, logo, name, color, serviceDescriptionNl, serviceDescriptionEn },
}) => {
	const canPreview = image || logo?.length > 0 || name?.length > 0;
	const locale = useLocale();

	return (
		<div className={clsx(className, styles['c-space-preview'])}>
			{canPreview && (
				<div className={clsx(styles['c-space-preview__summary'], 'u-mb-24')}>
					<CardImage id={id} color={color} image={image} logo={logo} />

					{name && <strong className="u-px-12 u-mb-0">{name}</strong>}
				</div>
			)}

			{locale === Locale.nl &&
				serviceDescriptionNl &&
				serviceDescriptionNl.length > 0 &&
				canPreview && (
					<Html
						className="u-mb-40 u-color-neutral c-content"
						content={serviceDescriptionNl}
						type="div"
					/>
				)}

			{locale === Locale.en &&
				serviceDescriptionEn &&
				serviceDescriptionEn.length > 0 &&
				canPreview && (
					<Html
						className="u-mb-40 u-color-neutral c-content"
						content={serviceDescriptionEn}
						type="div"
					/>
				)}
		</div>
	);
};

export default SpacePreview;

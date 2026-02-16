import type { SpacePreviewProps } from '@shared/components/SpacePreview/SpacePreview.types';
import SpacePreviewHeader from '@shared/components/SpacePreview/SpacePreviewHeader';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { Locale } from '@shared/utils/i18n';
import clsx from 'clsx';
import type { FC } from 'react';

import Html from '../Html/Html';

import styles from './SpacePreview.module.scss';

const SpacePreview: FC<SpacePreviewProps> = ({
	className,
	showLogoAndName = true,
	visitorSpace,
}) => {
	const { image, logo, name, serviceDescriptionNl, serviceDescriptionEn } = visitorSpace;
	const canPreview = image || logo?.length > 0 || name?.length > 0;
	const locale = useLocale();

	return (
		<div className={clsx(className, styles['c-space-preview'])}>
			{showLogoAndName && <SpacePreviewHeader visitorSpace={visitorSpace} className="u-mb-24" />}

			{locale === Locale.nl &&
				serviceDescriptionNl &&
				serviceDescriptionNl.length > 0 &&
				serviceDescriptionNl !== '<p></p>' &&
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
				serviceDescriptionEn !== '<p></p>' &&
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

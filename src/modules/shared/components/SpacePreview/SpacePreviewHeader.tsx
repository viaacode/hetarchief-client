import type { SpacePreviewHeaderProps } from '@shared/components/SpacePreview/SpacePreview.types';
import clsx from 'clsx';
import type { FC } from 'react';

import { CardImage } from '../CardImage';

import styles from './SpacePreview.module.scss';

const SpacePreviewHeader: FC<SpacePreviewHeaderProps> = ({
	className,
	visitorSpace: { id, image, logo, name, color },
}) => {
	const canPreview = image || logo?.length > 0 || name?.length > 0;

	if (!canPreview) {
		return null;
	}

	return (
		<div className={clsx(className, styles['c-space-preview__summary'])}>
			<CardImage id={id} color={color} image={image} logo={logo} />

			{name && <strong className="u-px-12 u-mb-0">{name}</strong>}
		</div>
	);
};

export default SpacePreviewHeader;

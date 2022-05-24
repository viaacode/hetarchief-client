import clsx from 'clsx';
import { FC } from 'react';

import { CardImage } from '../CardImage';
import Html from '../Html/Html';

import styles from './SpacePreview.module.scss';
import { SpacePreviewProps } from './SpacePreview.types';

const SpacePreview: FC<SpacePreviewProps> = ({
	className,
	space: { id, image, logo, name, color, serviceDescription },
}) => {
	const canPreview = image || logo?.length > 0 || name?.length > 0;

	return (
		<div className={clsx(className, styles['c-space-preview'])}>
			{canPreview && (
				<div className={clsx(styles['c-space-preview__summary'], 'u-mb-24')}>
					<CardImage id={id} color={color} image={image} logo={logo} />

					{name && <strong className="u-px-12 u-mb-0">{name}</strong>}
				</div>
			)}

			{serviceDescription && serviceDescription.length > 0 && canPreview && (
				<Html className="u-mb-40 u-color-neutral" content={serviceDescription} type="div" />
			)}
		</div>
	);
};

export default SpacePreview;

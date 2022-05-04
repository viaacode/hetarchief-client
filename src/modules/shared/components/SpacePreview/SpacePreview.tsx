import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { FC } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

import { CardImage } from '../CardImage';

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
				<div
					className="u-mb-40 u-color-neutral"
					dangerouslySetInnerHTML={{
						__html: String(
							DOMPurify.sanitize(
								serviceDescription, // rich-text content
								RICH_TEXT_SANITIZATION
							)
						),
					}}
				/>
			)}
		</div>
	);
};

export default SpacePreview;

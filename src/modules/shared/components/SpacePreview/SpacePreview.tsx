import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { RICH_TEXT_SANITIZATION } from '@shared/const';

import { CardImage } from '../CardImage';

import styles from './SpacePreview.module.scss';
import { SpacePreviewProps } from './SpacePreview.types';

const SpacePreview: FC<SpacePreviewProps> = ({
	className,
	spaceId,
	spaceImage,
	spaceLogo,
	spaceName,
	spaceColor,
	spaceServiceDescription,
}) => {
	const canPreview = spaceImage || spaceLogo || spaceName;

	return (
		<div className={clsx(className, styles['c-space-preview'])}>
			{canPreview && (
				<div className={clsx(styles['c-space-preview__summary'], 'u-mb-24')}>
					<CardImage
						id={spaceId}
						color={spaceColor}
						image={spaceImage}
						logo={spaceLogo}
					/>

					{spaceName && <strong className="u-px-12 u-mb-0">{spaceName}</strong>}
				</div>
			)}

			{spaceServiceDescription && spaceServiceDescription.length > 0 && canPreview && (
				<div
					className="u-mb-40 u-color-neutral"
					dangerouslySetInnerHTML={{
						__html: String(
							DOMPurify.sanitize(
								spaceServiceDescription, // rich-text content
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

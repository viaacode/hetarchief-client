import {
	getAiEntityAvatarColors,
	getAiEntityInitials,
} from '@ie-objects/utils/get-ai-entity-avatar-colors';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import styles from './AiEntityPortrait.module.scss';

export interface AiEntityPortraitProps {
	name: string;
	/** Reference still; initials on a tertiary colour take its place when missing or broken */
	still: string | null;
	size: 'xs' | 'sm' | 'lg';
	className?: string;
}

export const AiEntityPortrait: FC<AiEntityPortraitProps> = ({ name, still, size, className }) => {
	const [hasImageFailed, setHasImageFailed] = useState(false);
	const showImage = !!still && !hasImageFailed;
	const colors = getAiEntityAvatarColors(name);

	return (
		<span
			className={clsx(
				styles['c-ai-entity-portrait'],
				styles[`c-ai-entity-portrait--${size}`],
				className
			)}
			style={showImage ? undefined : { backgroundColor: colors.background, color: colors.text }}
		>
			{showImage ? (
				// biome-ignore lint/performance/noImgElement: small reference still served as-is from the AI dataset, nothing for next/image to optimise
				<img
					className={styles['c-ai-entity-portrait__image']}
					src={still}
					alt=""
					onError={() => setHasImageFailed(true)}
				/>
			) : (
				getAiEntityInitials(name)
			)}
		</span>
	);
};

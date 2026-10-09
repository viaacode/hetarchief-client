import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import {
	getAiEntityAvatarColors,
	getAiEntityFirstLetter,
	getAiEntityInitials,
} from '@ie-objects/utils/get-ai-entity-avatar-colors';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import clsx from 'clsx';
import { type FC, useState } from 'react';

import styles from './AiEntityPortrait.module.scss';

export interface AiEntityPortraitProps {
	entity: AiEntity;
	size: 'xs' | 'sm' | 'lg';
	className?: string;
}

// A person shows the reference still, or their initials on a tertiary colour when it is missing or
// broken. A place or organisation has no still and shows the first letter of its name
export const AiEntityPortrait: FC<AiEntityPortraitProps> = ({ entity, size, className }) => {
	const { name, type } = entity;
	const isPerson = type === FileMentionEntityType.PERSON;
	const still = isPerson ? entity.still : null;
	const [hasImageFailed, setHasImageFailed] = useState(false);
	const showImage = !!still && !hasImageFailed;
	const colors = getAiEntityAvatarColors(name);

	const renderContent = () => {
		if (showImage) {
			return (
				// biome-ignore lint/performance/noImgElement: small reference still served as-is from the AI dataset, nothing for next/image to optimise
				<img
					className={styles['c-ai-entity-portrait__image']}
					src={still}
					alt=""
					onError={() => setHasImageFailed(true)}
				/>
			);
		}

		return isPerson ? getAiEntityInitials(name) : getAiEntityFirstLetter(name);
	};

	return (
		<span
			className={clsx(
				styles['c-ai-entity-portrait'],
				styles[`c-ai-entity-portrait--${size}`],
				className
			)}
			style={showImage ? undefined : { backgroundColor: colors.background, color: colors.text }}
		>
			{renderContent()}
		</span>
	);
};

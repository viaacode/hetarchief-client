import { Card } from '@meemoo/react-components';
import { CardImage } from '@shared/components/CardImage';
import { Icon } from '@shared/components/Icon';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { ObjectPlaceholder } from '../ObjectPlaceholder';
import styles from './RelatedObject.module.scss';
import type { RelatedObjectProps } from './RelatedObject.types';

const RelatedObject: FC<RelatedObjectProps> = ({ className, object }) => {
	const { thumbnail, type, hasAccessToEssence = true } = object;
	const rootCls = clsx(className, styles['c-related-object']);
	const titleIcon = getIconFromObjectType(type, hasAccessToEssence);

	const renderImage = () => {
		if (!hasAccessToEssence) {
			return <ObjectPlaceholder className={styles['c-related-object__placeholder']} small />;
		}

		if (!thumbnail) {
			// The essence is within reach, there just is no image for it. Show the plain type icon
			// rather than the placeholder, which reads as a permission problem.
			const typeIcon = getIconFromObjectType(type, true);
			return (
				<span className={styles['c-related-object__type-icon']} aria-hidden="true">
					{typeIcon && <Icon name={typeIcon} />}
				</span>
			);
		}

		if (typeof thumbnail === 'string') {
			return (
				<CardImage
					className={styles['c-related-object__image']}
					name={object.title}
					id={object.id}
					size="small"
					image={type === 'audio' ? '/images/waveform--white.svg' : thumbnail}
				/>
			);
		}
		return thumbnail;
	};

	return (
		<Card
			className={rootCls}
			edge="zinc"
			orientation="horizontal"
			padding="content"
			subtitle={object.subtitle}
			title={
				<>
					{titleIcon && <Icon name={titleIcon} aria-hidden />}
					<strong>{object.title}</strong>
				</>
			}
			image={renderImage()}
		>
			{object.description}
		</Card>
	);
};

export default RelatedObject;

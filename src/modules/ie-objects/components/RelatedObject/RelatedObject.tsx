import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { CardImage } from '@shared/components/CardImage';
import { Icon } from '@shared/components/Icon';
import { TYPE_TO_ICON_MAP } from '@shared/components/MediaCard';

import { ObjectPlaceholder } from '../ObjectPlaceholder';

import styles from './RelatedObject.module.scss';
import type { RelatedObjectProps } from './RelatedObject.types';

const RelatedObject: FC<RelatedObjectProps> = ({ className, object }) => {
	const { thumbnail, type } = object;
	const rootCls = clsx(className, styles['c-related-object']);

	const renderImage = () => {
		if (thumbnail) {
			if (typeof thumbnail === 'string') {
				return (
					<CardImage
						className={styles['c-related-object__image']}
						unoptimized
						name={object.title}
						id={object.id}
						size="small"
						image={type === 'audio' ? '/images/waveform--white.svg' : thumbnail}
					/>
				);
			}
			return thumbnail;
		}
		return <ObjectPlaceholder className={styles['c-related-object__placeholder']} small />;
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
					{object.type && <Icon name={TYPE_TO_ICON_MAP[object.type]} />}
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

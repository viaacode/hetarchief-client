import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC } from 'react';

import { Icon, IconLightNames } from '@shared/components';
import { CardImage } from '@shared/components/CardImage';

import { ObjectPlaceholder } from '../ObjectPlaceholder';

import styles from './RelatedObject.module.scss';
import { RelatedObjectProps } from './RelatedObject.types';

const RelatedObject: FC<RelatedObjectProps> = ({ className, object }) => {
	const { thumbnail } = object;
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
						image={thumbnail}
					/>
				);
			} else {
				return thumbnail;
			}
		} else {
			return <ObjectPlaceholder className={styles['c-related-object__placeholder']} small />;
		}
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
					<Icon name={object.type as IconLightNames} />
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

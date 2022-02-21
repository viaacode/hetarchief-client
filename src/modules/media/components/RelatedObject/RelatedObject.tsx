import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC } from 'react';

import { Icon } from '@shared/components';
import { CardImage } from '@shared/components/CardImage';

import styles from './RelatedObject.module.scss';
import { RelatedObjectProps } from './RelatedObject.types';

const RelatedObject: FC<RelatedObjectProps> = ({ className, object }) => {
	const rootCls = clsx(className, styles['c-related-object']);

	return (
		<Card
			className={rootCls}
			edge="zinc"
			orientation="horizontal"
			padding="content"
			subtitle={object.subtitle}
			title={
				<>
					<Icon name={object.type} />
					<strong>{object.title}</strong>
				</>
			}
			image={
				<CardImage
					name={object.title}
					id={object.id}
					size="small"
					image={object.thumbnail}
				/>
			}
		>
			{object.description}
		</Card>
	);
};

export default RelatedObject;

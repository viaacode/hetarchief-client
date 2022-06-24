import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import { kebabCase } from 'lodash-es';
import { FC } from 'react';

import { CardImage } from '../CardImage';

import { VisitorSpaceCardType } from './VisitorSpaceCard.const';
import styles from './VisitorSpaceCard.module.scss';
import { VisitorSpaceCardProps } from './VisitorSpaceCard.types';
import { VisitorSpaceCardControls } from './VisitorSpaceCardControls';

const VisitorSpaceCard: FC<VisitorSpaceCardProps> = (props) => {
	const { room, type } = props;

	const typeNoAccess = type === VisitorSpaceCardType.noAccess;
	const typeAccessGranted = type === VisitorSpaceCardType.access;
	const typeAccessAccepted = type === VisitorSpaceCardType.futureApproved;
	const typeAccessRequested = type === VisitorSpaceCardType.futureRequested;

	const rootCls = clsx(
		styles['c-visitor-space-card'],
		`c-visitor-space-card--name--${kebabCase(room?.name || room?.id).toLowerCase()}`,
		{
			[styles['c-visitor-space-card--granted']]: typeAccessGranted,
		}
	);

	const flat = typeAccessAccepted || typeAccessRequested;
	const hasRequested = typeAccessGranted || typeAccessAccepted || typeAccessRequested;

	const renderImage = () => {
		let size: 'small' | 'short' | 'tall' | null = null;

		if (typeNoAccess) {
			size = 'short';
		} else if (typeAccessGranted) {
			size = 'tall';
		} else if (flat) {
			size = 'small';
		}

		return (
			<CardImage
				color={room.color}
				logo={room.logo}
				name={room.name}
				id={room.id}
				image={room.image}
				size={size || 'short'}
				shadow={typeNoAccess}
			/>
		);
	};

	const renderTitle = () => {
		if (typeAccessGranted) {
			return (
				<h2
					className={clsx(
						styles['c-visitor-space-card__title'],
						styles['c-visitor-space-card__title--large']
					)}
				>
					{room?.name || room?.id}
				</h2>
			);
		}

		return (
			<b
				className={clsx(
					styles['c-visitor-space-card__title'],
					flat && styles['c-visitor-space-card__title--flat']
				)}
			>
				{room?.name || room?.id}
			</b>
		);
	};

	const renderDescription = () => (
		<div className={`u-text-ellipsis--${flat ? 2 : 3}`}>
			<p
				className={clsx(
					styles['c-visitor-space-card__description'],
					flat && styles['c-visitor-space-card__description--flat']
				)}
			>
				{room?.info}
			</p>
		</div>
	);

	const mode = typeAccessGranted ? 'dark' : 'light';
	const orientation = hasRequested ? 'horizontal' : typeNoAccess ? 'vertical--at-md' : 'vertical';
	const padding = hasRequested ? 'content' : 'vertical';

	return (
		<Card
			className={rootCls}
			edge="none"
			image={renderImage()}
			mode={mode}
			offset={typeAccessGranted}
			orientation={orientation}
			padding={padding}
			title={!flat && renderTitle()}
			shadow={flat}
			onClick={props.onClick}
		>
			<div
				className={clsx(
					styles['c-visitor-space-card__wrapper'],
					flat && styles['c-visitor-space-card__wrapper--flat']
				)}
			>
				<div
					className={clsx(
						styles['c-visitor-space-card__content'],
						flat && styles['c-visitor-space-card__content--flat']
					)}
				>
					{flat && renderTitle()}
					{renderDescription()}
				</div>

				<VisitorSpaceCardControls {...props} />
			</div>
		</Card>
	);
};

export default VisitorSpaceCard;

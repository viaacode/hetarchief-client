import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { CardImage } from '../CardImage';

import { ReadingRoomCardType } from './ReadingRoomCard.const';
import styles from './ReadingRoomCard.module.scss';
import { VisitorSpaceCardProps } from './ReadingRoomCard.types';
import { ReadingRoomCardControls } from './ReadingRoomCardControls';

const ReadingRoomCard: FC<VisitorSpaceCardProps> = (props) => {
	const { room, type } = props;

	const typeNoAccess = type === ReadingRoomCardType.noAccess;
	const typeAccessGranted = type === ReadingRoomCardType.access;
	const typeAccessAccepted = type === ReadingRoomCardType.futureApproved;
	const typeAccessRequested = type === ReadingRoomCardType.futureRequested;

	const rootCls = clsx(styles['c-reading-room-card'], {
		[styles['c-reading-room-card--granted']]: typeAccessGranted,
	});

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
						styles['c-reading-room-card__title'],
						styles['c-reading-room-card__title--large']
					)}
				>
					{room?.name || room?.id}
				</h2>
			);
		}

		return (
			<b
				className={clsx(
					styles['c-reading-room-card__title'],
					flat && styles['c-reading-room-card__title--flat']
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
					styles['c-reading-room-card__description'],
					flat && styles['c-reading-room-card__description--flat']
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
					styles['c-reading-room-card__wrapper'],
					flat && styles['c-reading-room-card__wrapper--flat']
				)}
			>
				<div
					className={clsx(
						styles['c-reading-room-card__content'],
						flat && styles['c-reading-room-card__content--flat']
					)}
				>
					{flat && renderTitle()}
					{renderDescription()}
				</div>

				<ReadingRoomCardControls {...props} />
			</div>
		</Card>
	);
};

export default ReadingRoomCard;

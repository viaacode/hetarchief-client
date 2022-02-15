import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import { ReadingRoomCardType } from './ReadingRoomCard.const';
import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomCardProps } from './ReadingRoomCard.types';
import { ReadingRoomCardControls } from './ReadingRoomCardControls';
import { ReadingRoomImage } from './ReadingRoomImage';

const ReadingRoomCard: FC<ReadingRoomCardProps> = ({ onClick, ...props }) => {
	const { room, type } = props;

	const typeNoAccess = type === ReadingRoomCardType.noAccess;
	const typeAccessGranted = type === ReadingRoomCardType.access;
	const typeAccessAccepted = type === ReadingRoomCardType.futureApproved;
	const typeAccessRequested = type === ReadingRoomCardType.futureRequested;

	const flat = typeAccessAccepted || typeAccessRequested;
	const hasRequested = typeAccessGranted || typeAccessAccepted || typeAccessRequested;
	const isClickable = typeof onClick !== 'undefined';

	const renderImage = () => {
		const imageVariant = typeNoAccess
			? 'short'
			: typeAccessGranted
			? 'tall'
			: flat
			? 'small'
			: undefined;
		return <ReadingRoomImage {...room} variant={imageVariant} />;
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
		<TruncateMarkup lines={flat ? 2 : 3}>
			<p
				className={clsx(
					styles['c-reading-room-card__description'],
					flat && styles['c-reading-room-card__description--flat']
				)}
			>
				{room?.description}
			</p>
		</TruncateMarkup>
	);

	const mode = typeAccessGranted ? 'dark' : 'light';
	const orientation = hasRequested ? 'horizontal' : typeNoAccess ? 'vertical--at-md' : 'vertical';
	const padding = hasRequested ? 'content' : 'vertical';

	const rootCls = clsx(styles['c-reading-room-card'], {
		[styles['c-reading-room-card--granted']]: typeAccessGranted,
		'u-cursor-pointer': isClickable,
	});

	const renderCard = () => (
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

				<ReadingRoomCardControls {...props} cardIsClickable={isClickable} />
			</div>
		</Card>
	);

	return isClickable ? (
		<div role="button" tabIndex={0} onClick={onClick}>
			{renderCard()}
		</div>
	) : (
		renderCard()
	);
};

export default ReadingRoomCard;

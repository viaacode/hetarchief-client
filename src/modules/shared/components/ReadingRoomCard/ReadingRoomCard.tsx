import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import { ReadingRoomCardType } from './ReadingRoomCard.const';
import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomCardProps } from './ReadingRoomCard.types';
import { ReadingRoomCardControls } from './ReadingRoomCardControls';

const ReadingRoomCard: FC<ReadingRoomCardProps> = (props) => {
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
		return (
			<div
				className={clsx(
					styles['c-reading-room-card__background'],
					typeNoAccess && styles['c-reading-room-card__background--short'],
					typeNoAccess && styles['c-reading-room-card__background--shadow'],
					typeAccessGranted && styles['c-reading-room-card__background--tall'],
					flat && styles['c-reading-room-card__background--small']
				)}
				style={{ backgroundColor: room?.color ? room?.color : '#009690' }}
			>
				{room?.image && (
					<div className={styles['c-reading-room-card__background--image']}>
						<Image
							src={room?.image}
							alt={room?.name || room?.id.toString()}
							layout="fill"
							objectFit="cover"
						/>
					</div>
				)}

				{room?.logo && (
					<div className={styles['c-reading-room-card__logo']}>
						<Image
							className={styles['c-reading-room-card__logo-image']}
							src={room?.logo || ''}
							alt={room?.name || room?.id.toString()}
							layout="fill"
							objectFit="contain"
						/>
					</div>
				)}
			</div>
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

import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import ReadingRoomCardControls from '../ReadingRoomCardControls/ReadingRoomCardControls';

import { ReadingRoomCardType } from './ReadingRoomCard.const';
import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomCardProps } from './ReadingRoomCard.types';

const ReadingRoomCard: FC<ReadingRoomCardProps> = (props) => {
	const { room, type } = props;

	const typeNoAccess = type === ReadingRoomCardType['no-access'];
	const typeAccessGranted = type === ReadingRoomCardType['access'];
	const typeAccessAccepted = type === ReadingRoomCardType['future--approved'];
	const typeAccessRequested = type === ReadingRoomCardType['future--requested'];

	const flat = typeAccessAccepted || typeAccessRequested;

	const renderImage = () => {
		return (
			<div
				className={clsx(
					styles['c-reading-room-card__background'],
					typeNoAccess && styles['c-reading-room-card__background--short'],
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
			<p className={clsx(styles['c-reading-room-card__description'])}>{room?.description}</p>
		</TruncateMarkup>
	);

	const getMode = () => {
		if (typeAccessGranted) {
			return 'dark';
		}

		return 'light';
	};

	const getOrientation = () => {
		if (typeAccessGranted || typeAccessAccepted || typeAccessRequested) {
			return 'horizontal';
		}

		if (typeNoAccess) {
			return 'vertical--at-md';
		}

		return 'vertical';
	};

	const getPadding = () => {
		if (typeAccessGranted || typeAccessAccepted || typeAccessRequested) {
			return 'content';
		}

		return 'vertical';
	};

	return (
		<Card
			edge="none"
			image={renderImage()}
			mode={getMode()}
			offset={typeAccessGranted}
			orientation={getOrientation()}
			padding={getPadding()}
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

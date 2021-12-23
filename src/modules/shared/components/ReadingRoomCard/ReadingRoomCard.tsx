import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';

import { Button } from '../Button/Button.stories';
import Card from '../Card/Card';
import ContactIconButton from '../ContactIconButton/ContactIconButton';
import Icon from '../Icon/Icon';

import { ReadingRoomCardType } from './ReadingRoomCard.constants';
import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomProps } from './ReadingRoomCard.types';

const ReadingRoomCard: FC<ReadingRoomProps> = ({
	access,
	onAccessRequest,
	onContactClick,
	room,
	type,
}) => {
	const isWaitingForAccess = !access?.granted && !access?.pending;
	const hasAccess = access?.granted && !access?.pending;

	const renderImage = () => {
		return (
			<div
				className={styles['c-reading-room-card__background']}
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

	const renderDescription = () => (
		<p className={styles['c-reading-room-card__description']}>{room?.description}</p>
	);

	const renderControls = () => {
		if (hasAccess) {
			return null; // TODO: add content for when the user has access
		}

		if (!isWaitingForAccess) {
			return (
				<>
					<Button
						className={clsx('c-button--sm', 'c-button--black')}
						onClick={() => onAccessRequest && onAccessRequest(room)}
					>
						Vraag toegang aan
					</Button>

					<ContactIconButton
						color="silver"
						onClick={() => onContactClick && onContactClick(room)}
					/>
				</>
			);
		} else {
			return (
				<>
					<Icon
						className={styles['c-reading-room-card__not-available']}
						type="light"
						name="not-available"
					/>

					<p>Momenteel is er geen toegang mogelijk tot deze leeszaal</p>

					<ContactIconButton
						color="silver"
						onClick={() => onContactClick && onContactClick(room)}
					/>
				</>
			);
		}
	};

	return (
		<Card
			image={renderImage()}
			edge="none"
			padding="vertical"
			title={<b className={styles['c-reading-room-card__title']}>{room?.name || room?.id}</b>}
		>
			{renderDescription()}

			<div
				className={clsx(
					styles['c-reading-room-card__controls'],
					type === ReadingRoomCardType['no-access'] &&
						styles['c-reading-room-card__controls--near']
				)}
			>
				{renderControls()}
			</div>
		</Card>
	);
};

export default ReadingRoomCard;

import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import { Card, Icon } from '..';
import { Button } from '../Button/Button.stories';
import ContactIconButton from '../ContactIconButton/ContactIconButton';

import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomProps } from './ReadingRoomCard.types';

import { readingRoomCardType } from '.';

const ReadingRoomCard: FC<ReadingRoomProps> = ({
	access,
	onAccessRequest,
	onContactClick,
	onVisitClick,
	room,
	type,
}) => {
	const isWaitingForAccess = !access?.granted && !access?.pending;
	const hasAccess = access?.granted && !access?.pending;

	const typeNoAccess = type === readingRoomCardType['no-access'];
	const typeAccessGranted = type === readingRoomCardType['access-granted'];

	const renderImage = () => {
		return (
			<div
				className={clsx(
					styles['c-reading-room-card__background'],
					typeNoAccess && styles['c-reading-room-card__background--short'],
					typeAccessGranted && styles['c-reading-room-card__background--tall']
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

		return <b className={styles['c-reading-room-card__title']}>{room?.name || room?.id}</b>;
	};

	const renderDescription = () => (
		<TruncateMarkup lines={3}>
			<p className={styles['c-reading-room-card__description']}>{room?.description}</p>
		</TruncateMarkup>
	);

	const renderControls = () => {
		if (hasAccess) {
			return (
				<>
					<Icon
						className={styles['c-reading-room-card__control-icon']}
						type="light"
						name="timer"
					/>

					<p>
						Beschikbaar tot <br />
						{new Date().toLocaleString('nl-BE', {
							dateStyle: 'medium',
							timeStyle: 'short',
						})}
					</p>

					<Button
						className={clsx('c-button--lg', 'c-button--white')}
						onClick={() => onVisitClick && onVisitClick(room)}
					>
						Bezoek de leeszaal
					</Button>
				</>
			);
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
						className={styles['c-reading-room-card__control-icon']}
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
			offset={typeAccessGranted}
			padding={typeAccessGranted ? 'content' : 'vertical'}
			orientation={typeAccessGranted ? 'horizontal' : 'vertical'}
			mode={typeAccessGranted ? 'dark' : 'light'}
			title={renderTitle()}
		>
			{renderDescription()}

			<div
				className={clsx(
					styles['c-reading-room-card__controls'],
					typeNoAccess && styles['c-reading-room-card__controls--near'],
					typeAccessGranted && styles['c-reading-room-card__controls--far'],
					typeAccessGranted && styles['c-reading-room-card__controls--light'],
					typeAccessGranted && styles['c-reading-room-card__controls--thinner']
				)}
			>
				{renderControls()}
			</div>
		</Card>
	);
};

export default ReadingRoomCard;

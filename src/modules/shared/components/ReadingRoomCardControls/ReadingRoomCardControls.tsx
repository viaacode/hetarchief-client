import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import { Icon, IconLightNames, ReadingRoomCardType } from '..';
import ContactIconButton from '../ContactIconButton/ContactIconButton';
import { ReadingRoomCardProps } from '../ReadingRoomCard/ReadingRoomCard.types';
import { formatDateTime } from '../ReadingRoomCard/ReadingRoomCard.utils';

import styles from './ReadingRoomCardControls.module.scss';

const ReadingRoomCardControls: FC<ReadingRoomCardProps> = ({
	access,
	onAccessRequest,
	onContactClick,
	onVisitClick,
	room,
	type,
}) => {
	const typeNoAccess = type === ReadingRoomCardType['no-access'];
	const typeAccessGranted = type === ReadingRoomCardType['access'];
	const typeAccessAccepted = type === ReadingRoomCardType['future--approved'];
	const typeAccessRequested = type === ReadingRoomCardType['future--requested'];

	const flat = typeAccessAccepted || typeAccessRequested;
	const wrap = typeAccessGranted;

	const renderLabel = (icon: IconLightNames, text: ReactNode) => {
		return (
			<div className={styles['c-reading-room-card-controls__label']}>
				<Icon
					className={styles['c-reading-room-card-controls__label-icon']}
					type="light"
					name={icon}
				/>

				<TruncateMarkup lines={2}>
					<p
						className={clsx(
							styles['c-reading-room-card-controls__label-text'],
							flat && 'u-text-ellipsis'
						)}
					>
						{text}
					</p>
				</TruncateMarkup>
			</div>
		);
	};

	const renderAccessGrantedControls = () => {
		return (
			<>
				{renderLabel(
					'timer',
					<>
						Beschikbaar tot <br />
						{access?.until && formatDateTime(access?.until)}
					</>
				)}

				<Button
					className={clsx('c-button--lg', 'c-button--white')}
					onClick={() => onVisitClick && onVisitClick(room)}
				>
					Bezoek de leeszaal
				</Button>
			</>
		);
	};

	const renderFutureApprovedControls = () => {
		return (
			<>
				{renderLabel('calendar', <>Vanaf {access?.from && formatDateTime(access.from)}</>)}

				<ContactIconButton
					color="silver"
					onClick={() => onContactClick && onContactClick(room)}
				/>
			</>
		);
	};

	const renderFutureRequestedControls = () => {
		return (
			<>
				<TagList tags={[{ id: 1, label: 'Aanvraag ingediend' }]} variants={['large']} />

				<ContactIconButton
					color="silver"
					onClick={() => onContactClick && onContactClick(room)}
				/>
			</>
		);
	};

	const renderNoAccessControls = () => {
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
	};

	const renderDefaultControls = () => {
		return (
			<>
				{renderLabel(
					'not-available',
					'Momenteel is er geen toegang mogelijk tot deze leeszaal'
				)}

				<ContactIconButton
					color="silver"
					onClick={() => onContactClick && onContactClick(room)}
				/>
			</>
		);
	};

	const renderControls = () => {
		switch (type) {
			case ReadingRoomCardType['access']:
				return renderAccessGrantedControls();

			case ReadingRoomCardType['no-access']:
				if (!access?.pending) {
					return renderNoAccessControls();
				} else {
					return renderDefaultControls();
				}

			case ReadingRoomCardType['future--approved']:
				return renderFutureApprovedControls();

			case ReadingRoomCardType['future--requested']:
				return renderFutureRequestedControls();

			default:
				return renderDefaultControls();
		}
	};

	return (
		<div
			className={clsx(
				styles['c-reading-room-card-controls'],
				typeNoAccess && styles['c-reading-room-card-controls--near'],
				wrap && styles['c-reading-room-card-controls--wrap'],
				...(flat
					? [
							styles['c-reading-room-card-controls--flat'],
							styles['c-reading-room-card-controls--near'],
							typeAccessAccepted && styles['c-reading-room-card-controls--neutral'],
					  ]
					: []),
				...(typeAccessGranted
					? [
							styles['c-reading-room-card-controls--far'],
							styles['c-reading-room-card-controls--light'],
							styles['c-reading-room-card-controls--thinner'],
					  ]
					: [])
			)}
		>
			{renderControls()}
		</div>
	);
};

export default ReadingRoomCardControls;

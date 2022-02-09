import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import { Icon, IconLightNames } from '../Icon';
import { ReadingRoomCardProps, ReadingRoomCardType } from '../ReadingRoomCard';
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
	const typeNoAccess = type === ReadingRoomCardType.noAccess;
	const typeAccessGranted = type === ReadingRoomCardType.access;
	const typeAccessAccepted = type === ReadingRoomCardType.futureApproved;
	const typeAccessRequested = type === ReadingRoomCardType.futureRequested;

	const flat = typeAccessAccepted || typeAccessRequested;
	const wrap = typeAccessGranted;

	const renderLabel = (icon: IconLightNames, text: ReactNode) => {
		return (
			<div className={styles['c-reading-room-card-controls__label']}>
				<Icon className={styles['c-reading-room-card-controls__label-icon']} name={icon} />

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

	const renderContactIconButton = () => (
		<div>
			<Button
				icon={<Icon name="contact" />}
				variants={['silver', 'sm']}
				onClick={() => onContactClick && onContactClick(room)}
			/>
		</div>
	);

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
					variants={['lg', 'white']}
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
				{renderContactIconButton()}
			</>
		);
	};

	const renderFutureRequestedControls = () => {
		return (
			<>
				<TagList tags={[{ id: 1, label: 'Aanvraag ingediend' }]} variants={['large']} />
				{renderContactIconButton()}
			</>
		);
	};

	const renderNoAccessControls = () => {
		return (
			<>
				<Button
					variants={['sm', 'black']}
					onClick={() => onAccessRequest && onAccessRequest(room)}
				>
					Vraag toegang aan
				</Button>

				{renderContactIconButton()}
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

				{renderContactIconButton()}
			</>
		);
	};

	const renderControls = () => {
		switch (type) {
			case ReadingRoomCardType.access:
				return renderAccessGrantedControls();

			case ReadingRoomCardType.noAccess:
				if (!access?.pending) {
					return renderNoAccessControls();
				} else {
					return renderDefaultControls();
				}

			case ReadingRoomCardType.futureApproved:
				return renderFutureApprovedControls();

			case ReadingRoomCardType.futureRequested:
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

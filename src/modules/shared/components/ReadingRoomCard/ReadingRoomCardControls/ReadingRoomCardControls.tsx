import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

import { Icon, IconLightNames } from '../../Icon';
import { ReadingRoomCardType } from '../ReadingRoomCard.const';
import { VisitorSpaceCardProps } from '../ReadingRoomCard.types';
import { formatDateTime } from '../ReadingRoomCard.utils';

import styles from './ReadingRoomCardControls.module.scss';

const ReadingRoomCardControls: FC<VisitorSpaceCardProps> = ({
	access,
	onAccessRequest,
	onContactClick,
	room,
	type,
}) => {
	const { t } = useTranslation();

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

				<div className="u-text-ellipsis--2">
					<p
						className={clsx(
							styles['c-reading-room-card-controls__label-text'],
							flat && 'u-text-ellipsis'
						)}
					>
						{text}
					</p>
				</div>
			</div>
		);
	};

	const renderContactIconButton = () => (
		<div>
			<Button
				icon={<Icon name="contact" />}
				variants={['silver']}
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
						{t(
							'modules/shared/components/reading-room-card/reading-room-card-controls/reading-room-card-controls___beschikbaar-tot'
						)}
						<br />
						{access?.until && formatDateTime(access?.until)}
					</>
				)}

				<Link href={`/${room.slug}`} passHref>
					<a>
						<Button variants={['lg', 'white']}>
							{t(
								'modules/shared/components/reading-room-card/reading-room-card-controls/reading-room-card-controls___bezoek-dit-digitaal-archief'
							)}
						</Button>
					</a>
				</Link>
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
					{t(
						'modules/shared/components/reading-room-card/reading-room-card-controls/reading-room-card-controls___vraag-toegang-aan'
					)}
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
					t(
						'modules/shared/components/reading-room-card/reading-room-card-controls/reading-room-card-controls___momenteel-is-er-geen-toegang-mogelijk-tot-deze-leeszaal'
					)
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

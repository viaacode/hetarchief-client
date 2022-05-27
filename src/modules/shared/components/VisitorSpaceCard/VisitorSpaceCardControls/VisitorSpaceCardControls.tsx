import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

import { Icon, IconLightNames } from '../../Icon';
import { VisitorSpaceCardType } from '../VisitorSpaceCard.const';
import { VisitorSpaceCardProps } from '../VisitorSpaceCard.types';
import { formatDateTime } from '../VisitorSpaceCard.utils';

import styles from './VisitorSpaceCardControls.module.scss';

const VisitorSpaceCardControls: FC<VisitorSpaceCardProps> = ({
	access,
	onAccessRequest,
	onContactClick,
	room,
	type,
}) => {
	const { t } = useTranslation();

	const typeNoAccess = type === VisitorSpaceCardType.noAccess;
	const typeAccessGranted = type === VisitorSpaceCardType.access;
	const typeAccessAccepted = type === VisitorSpaceCardType.futureApproved;
	const typeAccessRequested = type === VisitorSpaceCardType.futureRequested;

	const flat = typeAccessAccepted || typeAccessRequested;
	const wrap = typeAccessGranted;

	const renderLabel = (icon: IconLightNames, text: ReactNode) => {
		return (
			<div className={styles['c-visitor-space-card-controls__label']}>
				<Icon className={styles['c-visitor-space-card-controls__label-icon']} name={icon} />

				<div className="u-text-ellipsis--2">
					<p
						className={clsx(
							styles['c-visitor-space-card-controls__label-text'],
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
						{t(
							'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___beschikbaar-tot'
						)}
						<br />
						{access?.until && formatDateTime(access?.until)}
					</>
				)}

				<Link href={`/${room.slug}`} passHref>
					<a>
						<Button variants={['lg', 'white']}>
							{t(
								'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___bezoek-dit-digitaal-archief'
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
						'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___vraag-toegang-aan'
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
						'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___momenteel-is-er-geen-toegang-mogelijk-tot-deze-bezoekersruimte'
					)
				)}

				{renderContactIconButton()}
			</>
		);
	};

	const renderControls = () => {
		switch (type) {
			case VisitorSpaceCardType.access:
				return renderAccessGrantedControls();

			case VisitorSpaceCardType.noAccess:
				if (!access?.pending) {
					return renderNoAccessControls();
				} else {
					return renderDefaultControls();
				}

			case VisitorSpaceCardType.futureApproved:
				return renderFutureApprovedControls();

			case VisitorSpaceCardType.futureRequested:
				return renderFutureRequestedControls();

			default:
				return renderDefaultControls();
		}
	};

	return (
		<div
			className={clsx(
				styles['c-visitor-space-card-controls'],
				typeNoAccess && styles['c-visitor-space-card-controls--near'],
				wrap && styles['c-visitor-space-card-controls--wrap'],
				...(flat
					? [
							styles['c-visitor-space-card-controls--flat'],
							styles['c-visitor-space-card-controls--near'],
							typeAccessAccepted && styles['c-visitor-space-card-controls--neutral'],
					  ]
					: []),
				...(typeAccessGranted
					? [
							styles['c-visitor-space-card-controls--far'],
							styles['c-visitor-space-card-controls--light'],
							styles['c-visitor-space-card-controls--thinner'],
					  ]
					: [])
			)}
		>
			{renderControls()}
		</div>
	);
};

export default VisitorSpaceCardControls;

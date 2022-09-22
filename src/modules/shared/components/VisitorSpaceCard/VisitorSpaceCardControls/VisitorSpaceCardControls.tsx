import { Button, TagList } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, MouseEvent, ReactNode } from 'react';

import { CopyButton, DropdownMenu } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';

import { Icon, IconLightNames } from '../../Icon';
import { VisitorSpaceCardType } from '../VisitorSpaceCard.const';
import { VisitorSpaceCardProps } from '../VisitorSpaceCard.types';
import { formatDateTime } from '../VisitorSpaceCard.utils';

import styles from './VisitorSpaceCardControls.module.scss';

const VisitorSpaceCardControls: FC<VisitorSpaceCardProps> = ({
	access,
	onAccessRequest,
	room,
	type,
}) => {
	const { tHtml, tText } = useTranslation();

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

	const renderContactIconButton = () => {
		if (!room.contactInfo.email?.length && !room.contactInfo.telephone?.length) {
			return (
				<Button
					icon={<Icon name="contact" aria-hidden />}
					aria-label={tText(
						'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___geen-contactgegevens-beschikbaar'
					)}
					variants={['silver', 'sm', 'disabled']}
					onClick={(evt: MouseEvent<HTMLButtonElement>) => {
						evt.stopPropagation();
						toastService.notify({
							title: tHtml(
								'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___geen-contact-gegevens'
							),
							description: tHtml(
								'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___er-zijn-geen-contactgegevens-gekend-voor-deze-bezoekersruimte'
							),
						});
					}}
				/>
			);
		}
		return (
			<div>
				<DropdownMenu
					placement="bottom-end"
					triggerButtonProps={{
						icon: <Icon name="contact" />,
						variants: ['silver', 'sm'],
					}}
				>
					<ul
						onClick={(e) => e.stopPropagation()}
						className={styles['c-visitor-space-card-controls__contact-list']}
					>
						{room.contactInfo.email && (
							<li className={styles['c-visitor-space-card-controls__contact-item']}>
								<p>{room.contactInfo.email}</p>

								<CopyButton
									text={room.contactInfo.email}
									variants={['sm', 'text']}
								/>
							</li>
						)}

						{room.contactInfo.telephone && (
							<li className={styles['c-visitor-space-card-controls__contact-item']}>
								<p>{room.contactInfo.telephone}</p>

								<CopyButton
									text={room.contactInfo.telephone}
									variants={['sm', 'text']}
								/>
							</li>
						)}
					</ul>
				</DropdownMenu>
			</div>
		);
	};

	const renderAccessGrantedControls = () => {
		return (
			<>
				{renderLabel(
					'timer',
					<>
						{tHtml(
							'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___beschikbaar-tot'
						)}
						<br />
						{access?.until && formatDateTime(access?.until)}
					</>
				)}

				<Link href={`/${room.slug}`} passHref>
					<a
						aria-label={tText(
							'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___bezoek-dit-digitaal-archief'
						)}
					>
						<Button variants={['lg', 'white']}>
							{tHtml(
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
				<TagList
					tags={[
						{
							id: 1,
							label: (
								<b>
									{tHtml(
										'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___aanvraag-ingediend'
									)}
								</b>
							),
						},
					]}
					variants={['large']}
				/>
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
					{tHtml(
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
					tHtml(
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

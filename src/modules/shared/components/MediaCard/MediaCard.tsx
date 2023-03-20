import {
	Badge,
	Button,
	Card,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import Image from 'next/image';
import Link from 'next/link';
import { FC, MouseEvent, ReactNode, useState } from 'react';
import Highlighter from 'react-highlight-words';

import { DropdownMenu, IconNamesLight, Modal } from '@shared/components';
import { TYPE_TO_NO_ICON_MAP } from '@shared/components/MediaCard';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { IeObjectTypes } from '@shared/types';
import { formatMediumDate } from '@shared/utils';

import Icon from '../Icon/Icon';

import styles from './MediaCard.module.scss';
import { MediaCardProps } from './MediaCard.types';

const MediaCard: FC<MediaCardProps> = ({
	description,
	duration,
	keywords,
	preview,
	publishedAt,
	publishedBy,
	title,
	type,
	view,
	id,
	actions,
	buttons,
	hasRelated,
	icon,
	isKeyUser,
	meemooIdentifier,
	showLocallyAvailable = false,
	link,
}) => {
	const { tText } = useTranslation();

	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

	const wrapInLink = (children: ReactNode) => {
		if (link) {
			return (
				<Link key={id} href={link}>
					<a className="u-text-no-decoration" aria-label={id}>
						{children}
					</a>
				</Link>
			);
		}

		return children;
	};

	const renderDropdown = () =>
		actions ? (
			<DropdownMenu
				triggerButtonProps={{
					className: clsx(
						styles['c-media-card__icon-button'],
						'c-button--text c-button--icon c-button--xxs'
					),
					onClick: (evt: MouseEvent) => {
						evt.stopPropagation();
						evt.nativeEvent.stopImmediatePropagation();
					},
				}}
			>
				{actions}
			</DropdownMenu>
		) : null;

	const renderToolbar = () => (
		<div className={styles['c-media-card__toolbar']}>
			{buttons}
			{renderDropdown()}
		</div>
	);

	const renderTitle = (): ReactNode => {
		if (typeof title === 'string') {
			return wrapInLink(
				<b className={`u-text-ellipsis--${view === 'grid' ? 7 : 3}`}>
					{keywords?.length ? highlighted(title ?? '') : title}
				</b>
			);
		}

		if (keywords && keywords.length > 0) {
			console.warn('[WARN][MediaCard] Title could not be highlighted.');
		}

		return wrapInLink(title);
	};

	const renderSubTitle = (): ReactNode => {
		return wrapInLink(meemooIdentifier);
	};

	const renderCaption = (): ReactNode => {
		let subtitle = '';

		if (publishedBy) {
			subtitle += publishedBy;
		}

		if (publishedAt) {
			const formatted = formatMediumDate(publishedAt);

			subtitle += ` (${formatted})`;
		}

		subtitle = subtitle.trim();

		return keywords?.length ? wrapInLink(highlighted(subtitle)) : wrapInLink(subtitle);
	};

	const renderNoContentIcon = () => (
		<Icon
			className={clsx(styles['c-media-card__no-content'], styles['c-media-card__icon'])}
			name={TYPE_TO_NO_ICON_MAP[type as Exclude<IeObjectTypes, null>]}
		/>
	);

	const renderDuration = () => (
		<div className={clsx(styles['c-media-card__header-duration'])}>{duration}</div>
	);

	const renderNoContent = () =>
		view === 'grid' ? (
			renderNoContentIcon()
		) : (
			<div className={clsx(styles['c-media-card__no-content-wrapper'])}>
				{renderNoContentIcon()}
				{duration && renderDuration()}
			</div>
		);

	const renderHeader = () => {
		switch (type) {
			case 'audio':
				// Only render the waveform if the thumbnail is available
				// The thumbnail is an ugly speaker icon that we never want to show
				// But if that thumbnail is not available it most likely means this object does not have the BEZOEKERTOOL-CONTENT license
				return renderImage(preview ? '/images/waveform.svg' : undefined);

			case 'video':
				return renderImage(preview);
			case 'film':
				return renderImage(preview);

			default:
				return renderNoContent();
		}
	};

	const renderTags = () => {
		return hasRelated && <Badge variants="small" text={<Icon name={IconNamesLight.Link} />} />;
	};

	const renderLocallyAvailablePill = () => {
		return (
			<div className={styles['c-media-card__locally-available-pill']}>
				<Icon
					name={IconNamesLight.Forbidden}
					className={styles['c-media-card__locally-available-pill--icon']}
				/>
				Enkel ter plaatse beschikbaar
			</div>
		);
	};

	const renderImage = (imgPath: string | undefined) =>
		imgPath
			? wrapInLink(
					<div
						className={clsx(
							styles['c-media-card__header-wrapper'],
							styles[`c-media-card__header-wrapper--${view}`]
						)}
					>
						<Image src={imgPath} alt={''} unoptimized={true} layout="fill" />
						{!isNil(icon) && (
							<>
								<div className={clsx(styles['c-media-card__header-icon'])}>
									<Icon name={icon} />
								</div>
								{showLocallyAvailable && renderLocallyAvailablePill()}
								{duration && renderDuration()}
							</>
						)}
					</div>
			  )
			: renderNoContent();

	const highlighted = (toHighlight: string) => {
		return (
			<Highlighter
				searchWords={keywords ?? []}
				autoEscape={true}
				textToHighlight={toHighlight}
			/>
		);
	};

	const renderKeyUserPill = () => {
		return (
			<span className={styles['c-media-card--key-user-pill']}>
				<Tooltip position="top">
					<TooltipTrigger>
						<Icon name={IconNamesLight.Key} />
					</TooltipTrigger>
					<TooltipContent>
						{tText(
							'modules/shared/components/media-card/media-card___item-bekijken-uit-jouw-sector'
						)}
					</TooltipContent>
				</Tooltip>
			</span>
		);
	};

	const renderLocallyAvailableButtons = () => {
		return (
			<div className={styles['c-media-card__locally-available-container']}>
				<Button
					iconStart={<Icon name={IconNamesLight.Info} />}
					label="Meer info"
					variants={['info']}
					className={styles['c-media-card__info-button']}
					onClick={() => setIsInfoModalOpen(true)}
				/>
				<Button
					label="Plan een bezoek"
					variants={['dark']}
					className={styles['c-media-card__visit-button']}
				/>
			</div>
		);
	};

	return (
		<div id={id}>
			<Card
				className={clsx(
					styles['c-media-card'],
					isKeyUser && styles['c-media-card--key-user']
				)}
				orientation={view === 'grid' ? 'vertical' : 'horizontal--at-md'}
				title={renderTitle()}
				image={renderHeader()}
				subtitle={renderSubTitle()}
				caption={renderCaption()}
				toolbar={renderToolbar()}
				tags={renderTags()}
				padding="both"
			>
				{typeof description === 'string' ? (
					<>
						{wrapInLink(
							<div className="u-text-ellipsis--2">
								<span>{description}</span>
							</div>
						)}
						{isKeyUser && renderKeyUserPill()}
						{showLocallyAvailable && renderLocallyAvailableButtons()}
					</>
				) : (
					<>
						{wrapInLink(description)}
						{isKeyUser && renderKeyUserPill()}
						{showLocallyAvailable && renderLocallyAvailableButtons()}
					</>
				)}
			</Card>
			<Modal
				title="Waarom kan ik dit object niet bekijken?"
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
				footer={
					<div className={styles['c-media-card__close-button-container']}>
						<Button
							label="Sluit"
							onClick={() => setIsInfoModalOpen(false)}
							variants={['dark']}
							className={styles['c-media-card__close-button']}
						/>
					</div>
				}
			>
				<p className={styles['c-media-card__infomodal-description']}>
					Dit object bevat geen licentie voor online raadpleging. Contacteer de aanbieder
					voor meer informatie.
				</p>
			</Modal>
		</div>
	);
};

export default MediaCard;

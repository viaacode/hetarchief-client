import { Badge, Card } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash';
import Image from 'next/image';
import { FC, MouseEvent, ReactNode } from 'react';
import Highlighter from 'react-highlight-words';

import { DropdownMenu, IconNamesLight } from '@shared/components';
import { TYPE_TO_NO_ICON_MAP } from '@shared/components/MediaCard';
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
}) => {
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
			return (
				<b className={`u-text-ellipsis--${view === 'grid' ? 7 : 3}`}>
					{keywords?.length ? highlighted(title ?? '') : title}
				</b>
			);
		}

		if (keywords && keywords.length > 0) {
			console.warn('[WARN][MediaCard] Title could not be highlighted.');
		}

		return title;
	};

	const renderSubtitle = (): ReactNode => {
		let subtitle = '';

		if (publishedBy) {
			subtitle += publishedBy;
		}

		if (publishedAt) {
			const formatted = formatMediumDate(publishedAt);

			subtitle += ` (${formatted})`;
		}

		subtitle = subtitle.trim();

		return keywords?.length ? highlighted(subtitle) : subtitle;
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

	const renderImage = (imgPath: string | undefined) =>
		imgPath ? (
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
						{duration && renderDuration()}
					</>
				)}
			</div>
		) : (
			renderNoContent()
		);

	const highlighted = (toHighlight: string) => {
		return (
			<Highlighter
				searchWords={keywords ?? []}
				autoEscape={true}
				textToHighlight={toHighlight}
			/>
		);
	};

	return (
		<div id={id}>
			<Card
				className={styles['c-media-card']}
				orientation={view === 'grid' ? 'vertical' : 'horizontal--at-md'}
				title={renderTitle()}
				image={renderHeader()}
				subtitle={renderSubtitle()}
				toolbar={renderToolbar()}
				tags={renderTags()}
				padding="both"
			>
				{typeof description === 'string' ? (
					<div className="u-text-ellipsis--2">
						<span>{description}</span>
					</div>
				) : (
					<>{description}</>
				)}
			</Card>
		</div>
	);
};

export default MediaCard;

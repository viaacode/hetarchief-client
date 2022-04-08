import { Card } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import { FC, MouseEvent, ReactNode } from 'react';
import Highlighter from 'react-highlight-words';
import TruncateMarkup from 'react-truncate-markup';

import { DropdownMenu } from '@shared/components';
import { formatWithLocale } from '@shared/utils';

import Icon from '../Icon/Icon';

import styles from './MediaCard.module.scss';
import { MediaCardProps } from './MediaCard.types';

const MediaCard: FC<MediaCardProps> = ({
	description,
	keywords,
	preview,
	publishedAt,
	publishedBy,
	title,
	type,
	view,
	actions,
	buttons,
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
			return <b>{keywords?.length ? highlighted(title ?? '') : title}</b>;
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
			const formatted = formatWithLocale('P', publishedAt);

			subtitle += ` (${formatted})`;
		}

		subtitle = subtitle.trim();

		return keywords?.length ? highlighted(subtitle) : subtitle;
	};

	const renderNoContentIcon = () => (
		<Icon
			className={clsx(styles['c-media-card__no-content'], styles['c-media-card__icon'])}
			name={`no-${type}` as 'no-audio' | 'no-video'}
		/>
	);

	const renderNoContent = () =>
		view === 'grid' ? (
			renderNoContentIcon()
		) : (
			<div className={clsx(styles['c-media-card__no-content-wrapper'])}>
				{renderNoContentIcon()}
			</div>
		);

	const renderHeader = () => {
		switch (type) {
			case 'audio':
				return renderPeak();
				break;

			case 'video':
				return renderImage();

			default:
				return renderNoContent();
		}
	};

	const renderImage = () =>
		preview ? (
			<div
				className={clsx(
					styles['c-media-card__header-wrapper'],
					styles[`c-media-card__header-wrapper--${view}`]
				)}
			>
				<Image src={preview} alt={''} unoptimized={true} layout="fill" />
			</div>
		) : (
			renderNoContent()
		);

	const renderPeak = renderNoContent;

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
		<Card
			orientation={view === 'grid' ? 'vertical' : 'horizontal--at-md'}
			title={renderTitle()}
			image={renderHeader()}
			subtitle={renderSubtitle()}
			toolbar={renderToolbar()}
			padding="both"
		>
			{/* // Wrapping this in a conditional ensures TruncateMarkup only renders after the content is received */}
			{description ? (
				typeof description === 'string' ? (
					<TruncateMarkup lines={2}>
						<span>{description}</span>
					</TruncateMarkup>
				) : (
					description
				)
			) : (
				// Passing a child to Card ensure whitespacing at the bottom is applied
				<></>
			)}
		</Card>
	);
};

export default MediaCard;

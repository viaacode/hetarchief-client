import { Button, Card } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { FC, MouseEvent, ReactNode, useState } from 'react';
import Highlighter from 'react-highlight-words';
import TruncateMarkup from 'react-truncate-markup';

import { DropdownMenu } from '@shared/components';

import Icon from '../Icon/Icon';

import styles from './MediaCard.module.scss';
import { MediaCardProps } from './MediaCard.types';
import { formatDate } from './MediaCard.utils';

const MediaCard: FC<MediaCardProps> = ({
	bookmarkIsSolid = false,
	description,
	keywords,
	preview,
	detailLink,
	publishedAt,
	publishedBy,
	title,
	type,
	view,
	onBookmark,
	actions,
}) => {
	const handleBookmarkButtonClick = (evt: MouseEvent) => {
		evt.stopPropagation();
		evt.nativeEvent.stopImmediatePropagation();
		if (onBookmark) {
			onBookmark(evt);
		}
	};

	const wrapInLink = (elem: ReactNode) => {
		return (
			<Link passHref href={detailLink}>
				<a className={styles['c-media-card__link']}>{elem}</a>
			</Link>
		);
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
			<Button
				className={styles['c-media-card__icon-button']}
				onClick={handleBookmarkButtonClick}
				icon={
					<Icon
						className={styles['c-media-card__icon']}
						type={bookmarkIsSolid ? 'solid' : 'light'}
						name="bookmark"
					/>
				}
				variants={['text', 'xxs']}
			/>

			{renderDropdown()}
		</div>
	);

	const renderTitle = () =>
		wrapInLink(<b>{keywords?.length ? highlighted(title ?? '') : title}</b>);

	const renderSubtitle = (): JSX.Element => {
		let subtitle = '';

		if (publishedBy) {
			subtitle += publishedBy;
		}

		if (publishedAt) {
			// TODO: connect to i18n locale
			const formatted = formatDate(publishedAt);

			subtitle += ` (${formatted})`;
		}

		subtitle = subtitle.trim();

		const subtitleWithHighlighting: ReactNode = keywords?.length ? (
			highlighted(subtitle)
		) : (
			<>{subtitle}</>
		);
		return wrapInLink(subtitleWithHighlighting);
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
		if (preview) {
			return (
				<div
					className={clsx(
						styles['c-media-card__header-wrapper'],
						styles[`c-media-card__header-wrapper--${view}`]
					)}
				>
					{wrapInLink(
						<Image src={preview} alt={title || ''} unoptimized={true} layout="fill" />
					)}
				</div>
			);
		} else {
			return renderNoContent();
		}
	};

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
				wrapInLink(
					typeof description === 'string' ? (
						<TruncateMarkup lines={2}>
							<span>{description}</span>
						</TruncateMarkup>
					) : (
						description
					)
				)
			) : (
				// Passing a child to Card ensure whitespacing at the bottom is applied
				<></>
			)}
		</Card>
	);
};

export default MediaCard;

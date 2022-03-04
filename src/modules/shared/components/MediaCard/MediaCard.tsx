import { Button, Card } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import { FC } from 'react';
import Highlighter from 'react-highlight-words';
import TruncateMarkup from 'react-truncate-markup';

import Icon from '../Icon/Icon';

import styles from './MediaCard.module.scss';
import { MediaCardProps } from './MediaCard.types';
import { formatDate } from './MediaCard.utils';

const MediaCard: FC<MediaCardProps> = ({
	bookmarkIsSolid = false,
	description,
	keywords,
	preview,
	publishedAt,
	publishedBy,
	title,
	type,
	view,
	onBookmark = () => null,
	onTitleClick,
}) => {
	const renderToolbar = () => (
		<div className={styles['c-media-card__toolbar']}>
			<Button
				className={styles['c-media-card__icon-button']}
				onClick={onBookmark}
				icon={
					<Icon
						className={styles['c-media-card__icon']}
						type={bookmarkIsSolid ? 'solid' : 'light'}
						name="bookmark"
					/>
				}
				variants={['text', 'xxs']}
			/>

			{/* TODO: uncomment & switch to dropdown / action / ... once more actions are required on a MediaCard
			see: https://meemoo.atlassian.net/browse/ARC-206?focusedCommentId=24402 */}
			{/* <Button
				className={clsx(
					styles['c-media-card__icon-button'],
					'c-button--text c-button--icon c-button--xxs'
				)}
				icon={
					<Icon
						className={styles['c-media-card__icon']}
						name="dots-vertical"
					/>
				}
			/> */}
		</div>
	);

	const renderTitle = () => (
		<b
			className={clsx({
				[styles['c-media-card__title--interactable']]: !!onTitleClick,
			})}
		>
			{keywords?.length ? highlighted(title ?? '') : title}
		</b>
	);

	const renderSubtitle = () => {
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

		return subtitle.length > 0 ? subtitle : undefined;
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
					<Image src={preview} alt={title || ''} unoptimized={true} layout="fill" />
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
			subtitle={keywords?.length ? highlighted(renderSubtitle() ?? '') : renderSubtitle()}
			toolbar={renderToolbar()}
			padding="both"
			{...(onTitleClick ? { onTitleClick } : {})}
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

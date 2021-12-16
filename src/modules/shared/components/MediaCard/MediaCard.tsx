import clsx from 'clsx';
import { FC } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import { Card, Icon } from '..';

import styles from './MediaCard.module.scss';

import { MediaCardProps } from '.';

const MediaCard: FC<MediaCardProps> = ({
	description,
	preview,
	published_at,
	published_by,
	thumbnail,
	title,
	type,
	view,
}) => {
	const showDescription = () => {
		switch (view) {
			case 'grid':
				return type === 'video';
			default:
				return true;
		}
	};

	const renderToolbar = () => (
		<div className={styles['c-media-card__toolbar']}>
			{/* TODO: Switch to icon buttons? */}
			<Icon className={styles['c-media-card__icon']} type="light" name="bookmark" />
			<Icon className={styles['c-media-card__icon']} type="light" name="dots-vertical" />
		</div>
	);

	const renderSubtitle = () => {
		let subtitle = '';

		if (published_by) {
			subtitle += published_by;
		}

		if (published_at) {
			// TODO: connect to i18n locale
			const formatted = published_at.toLocaleDateString('nl-BE', {
				dateStyle: 'medium',
			});

			subtitle += ` (${formatted})`;
		}

		return subtitle.length > 0 ? subtitle : undefined;
	};

	const renderNoVideoIcon = () => (
		<Icon
			className={clsx(styles['c-media-card__no-video'], styles['c-media-card__icon'])}
			type="light"
			name="no-video"
		/>
	);

	const renderHeader = () => {
		switch (type) {
			case 'audio':
				return preview;

			case 'video':
				return thumbnail;

			default:
				// 'meta'
				return view === 'grid' ? (
					renderNoVideoIcon()
				) : (
					<div className={clsx(styles['c-media-card__no-video-wrapper'])}>
						{renderNoVideoIcon()}
					</div>
				);
		}
	};

	return (
		<Card
			orientation={view === 'grid' ? 'vertical' : 'horizontal'}
			title={<b>{title}</b>}
			image={renderHeader()}
			subtitle={renderSubtitle()}
			toolbar={renderToolbar()}
			padding="both"
		>
			{/* // Wrapping this in a conditional ensures TruncateMarkup only renders after the content is received */}
			{description && showDescription() ? (
				<TruncateMarkup lines={view === 'grid' ? 1 : 2}>
					<span>{description}</span>
				</TruncateMarkup>
			) : (
				// Passing a child to Card ensure whitespacing at the bottom is applied
				<></>
			)}
		</Card>
	);
};

export default MediaCard;

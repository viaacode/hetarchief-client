import clsx from 'clsx';
import { FC } from 'react';
import TruncateMarkup from 'react-truncate-markup';

import { Card, Icon } from '..';
import { Button } from '../Button/Button.stories';

import styles from './MediaCard.module.scss';

import { MediaCardProps } from '.';

const MediaCard: FC<MediaCardProps> = ({
	description,
	preview,
	published_at,
	published_by,
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
			<Button
				className={clsx(
					styles['c-media-card__icon-button'],
					'c-button--text c-button--icon c-button--xxs c-button--ghost'
				)}
				icon={
					<Icon className={styles['c-media-card__icon']} type="light" name="bookmark" />
				}
			/>

			{/* TODO: uncomment & switch to dropdown / action / ... once more actions are required on a MediaCard
			see: https://meemoo.atlassian.net/browse/ARC-206?focusedCommentId=24402 */}
			{/* <Button
				className={clsx(
					styles['c-media-card__icon-button'],
					'c-button--text c-button--icon c-button--xxs c-button--ghost'
				)}
				icon={
					<Icon
						className={styles['c-media-card__icon']}
						type="light"
						name="dots-vertical"
					/>
				}
			/> */}
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

		subtitle = subtitle.trim();

		return subtitle.length > 0 ? subtitle : undefined;
	};

	const renderNoContentIcon = () => (
		<Icon
			className={clsx(styles['c-media-card__no-content'], styles['c-media-card__icon'])}
			type="light"
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

	const renderHeader = () => preview || renderNoContent();

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

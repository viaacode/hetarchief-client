import { Button, Card, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { FC, MouseEvent, ReactNode, useState } from 'react';
import Highlighter from 'react-highlight-words';
import TruncateMarkup from 'react-truncate-markup';

import { formatWithLocale } from '@shared/utils';

import Icon from '../Icon/Icon';

import styles from './MediaCard.module.scss';
import { MediaCardProps } from './MediaCard.types';
import { formatDate } from './MediaCard.utils';

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
	const [isDropdownOpen, setDropdownOpen] = useState(false);

	const renderDropdown = () =>
		actions ? (
			<Dropdown isOpen={isDropdownOpen}>
				<DropdownButton>
					<Button
						className={clsx(
							styles['c-media-card__icon-button'],
							'c-button--text c-button--icon c-button--xxs'
						)}
						icon={
							<Icon className={styles['c-media-card__icon']} name="dots-vertical" />
						}
						onClick={(evt) => {
							evt.stopPropagation();
							evt.nativeEvent.stopImmediatePropagation();
							setDropdownOpen(!isDropdownOpen);
						}}
					/>
				</DropdownButton>

				<DropdownContent>{actions}</DropdownContent>
			</Dropdown>
		) : null;

	const renderToolbar = () => (
		<div className={styles['c-media-card__toolbar']}>
			{buttons}
			{renderDropdown()}
		</div>
	);

	const renderTitle = () => <b>{keywords?.length ? highlighted(title ?? '') : title}</b>;

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

		return keywords?.length ? highlighted(subtitle) : <>{subtitle}</>;
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

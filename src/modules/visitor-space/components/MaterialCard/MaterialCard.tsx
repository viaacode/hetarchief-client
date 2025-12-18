import { AdminConfigManager } from '@meemoo/admin-core-ui/admin';
import { Card } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { IeObjectType } from '@shared/types/ie-objects';
import { asDate, formatMediumDate } from '@shared/utils/dates';
import clsx from 'clsx';
import { isValid } from 'date-fns';
import { isNil } from 'lodash-es';
import { default as NextLink } from 'next/link';
import type { FC, ReactNode } from 'react';
import styles from './MaterialCard.module.scss';
import type { MaterialCardProps } from './MaterialCard.types';

const MaterialCard: FC<MaterialCardProps> = ({
	className,
	objectId,
	title,
	thumbnail,
	hideThumbnail = false,
	link,
	type,
	publishedBy,
	publishedOrCreatedDate,
	icon,
	withBorder = true,
	orientation,
	children,
	renderAdditionalCaption,
}) => {
	const withThumbnail = !!thumbnail || !hideThumbnail;

	const renderTitle = (): ReactNode => {
		if (typeof title === 'string') {
			return <b className={`u-text-ellipsis--3`}>{title}</b>;
		}

		return title;
	};

	const renderCaption = (): ReactNode => {
		let subtitle = '';

		if (publishedBy) {
			subtitle += publishedBy;
		}

		if (publishedOrCreatedDate) {
			const date = asDate(publishedOrCreatedDate);
			if (isValid(date)) {
				const formatted = formatMediumDate(date);

				subtitle += ` (${formatted})`;
			} else {
				subtitle += ` (${publishedOrCreatedDate})`;
			}
		}

		subtitle = subtitle.trim();

		return renderAdditionalCaption?.(subtitle) || subtitle;
	};

	const renderNoContentIcon = () => {
		return (
			<Icon
				className={clsx(
					styles['c-material-card__no-content-icon'],
					styles['c-material-card__icon'],
					{
						[styles['c-material-card__no-content-icon']]: !link,
					}
				)}
				name={getIconFromObjectType(type as IeObjectType, false)}
			/>
		);
	};

	const renderImage = (imgPath: string | undefined) => {
		let imagePath: string | undefined = imgPath;
		if (!imagePath) {
			return (
				<div
					className={clsx(
						styles['c-material-card__header'],
						styles['c-material-card__header--no-content']
					)}
				>
					{renderNoContentIcon()}
				</div>
			);
		}

		if (hideThumbnail) {
			return (
				<div
					className={clsx(
						styles['c-material-card__header'],
						styles['c-material-card__header--no-content']
					)}
				>
					{!isNil(icon) && (
						<Icon
							className={clsx(
								styles['c-material-card__no-content-icon'],
								styles['c-material-card__icon'],
								{
									[styles['c-material-card__no-content-icon']]: !link,
								}
							)}
							name={icon}
						/>
					)}
				</div>
			);
		}

		if (type === IeObjectType.AUDIO || type === IeObjectType.AUDIO_FRAGMENT) {
			// Only render the waveform if the thumbnail is available
			// The thumbnail is an ugly speaker icon that we never want to show
			// But if that thumbnail is not available it most likely means this object does not have the BEZOEKERTOOL-CONTENT license
			imagePath = AdminConfigManager.getConfig().components.defaultAudioStill;
		}

		return (
			<div className={clsx(styles['c-material-card__header'])}>
				{/** biome-ignore lint/performance/noImgElement: we need this*/}
				<img src={imagePath} alt={''} width="100%" height="100%" />
				{!isNil(icon) && (
					<div className={clsx(styles['c-material-card__header-icon'])}>
						<Icon name={icon} />
					</div>
				)}
			</div>
		);
	};

	const classNames = clsx(
		styles['c-material-card'],
		`c-material-card--${type}`,
		!link && 'c-material-card--no-link',
		withThumbnail && 'c-material-card--with-thumbnail'
	);

	return (
		<div className={className}>
			<NextLink passHref href={link} style={{ textDecoration: 'none' }}>
				<Card
					className={classNames}
					orientation={orientation}
					edge={withBorder ? 'zinc' : 'none'}
					title={renderTitle()}
					image={renderImage(thumbnail)}
					subtitle={objectId}
					caption={renderCaption()}
					padding="both"
				>
					{children}
				</Card>
			</NextLink>
		</div>
	);
};

export default MaterialCard;

import { AdminConfigManager } from '@meemoo/admin-core-ui/dist/admin.mjs';
import { Badge, Button, Card } from '@meemoo/react-components';
import clsx from 'clsx';
import { isValid } from 'date-fns';
import { isNil } from 'lodash-es';
import { useRouter } from 'next/router';
import { type FC, type MouseEvent, type ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import {
	RequestAccessBlade,
	type RequestAccessFormState,
} from '@home/components/RequestAccessBlade';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { extractSnippetBySearchTerm } from '@ie-objects/utils/extract-snippet-by-search-term';
import { DropdownMenu } from '@shared/components/DropdownMenu';
import HighlightSearchTerms from '@shared/components/HighlightedMetadata/HighlightSearchTerms';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { TRUNCATED_TEXT_LENGTH, TYPE_TO_NO_ICON_MAP } from '@shared/components/MediaCard';
import { Modal } from '@shared/components/Modal';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { Pill } from '@shared/components/Pill';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { setLastScrollPosition } from '@shared/store/ui';
import { IeObjectType } from '@shared/types/ie-objects';
import { asDate, formatMediumDate } from '@shared/utils/dates';

import Icon from '../Icon/Icon';

import styles from './MediaCard.module.scss';
import type { MediaCardProps } from './MediaCard.types';

const MediaCard: FC<MediaCardProps> = ({
	description,
	duration,
	keywords,
	thumbnail,
	publishedOrCreatedDate,
	publishedBy,
	title,
	type,
	view,
	id,
	objectId,
	actions,
	buttons,
	hasRelated,
	icon,
	showKeyUserLabel,
	showLocallyAvailable = false,
	showPlanVisitButtons = false,
	link,
	maintainerSlug,
	hasTempAccess,
	previousPage,
	numOfChildren = 0,
	className,
}) => {
	const router = useRouter();
	const locale = useLocale();
	const dispatch = useDispatch();

	const [, setQuery] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});

	const user = useSelector(selectUser);
	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [isRequestAccessBladeOpen, setIsRequestAccessBladeOpen] = useState(false);

	const saveScrollPosition = () => {
		if (id && previousPage) {
			dispatch(setLastScrollPosition({ itemId: id, page: previousPage }));
		}
	};

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
			if (!user || !maintainerSlug) {
				toastService.notify({
					title: tText('modules/shared/components/media-card/media-card___je-bent-niet-ingelogd'),
					description: tText(
						'modules/shared/components/media-card/media-card___je-bent-niet-ingelogd-log-opnieuw-in-en-probeer-opnieuw'
					),
				});
				return;
			}

			const createdVisitRequest = await createVisitRequest({
				acceptedTos: values.acceptTerms,
				reason: values.requestReason,
				visitorSpaceSlug: maintainerSlug as string,
				timeframe: values.visitTime,
			});

			setIsRequestAccessBladeOpen(false);
			await router.push(
				ROUTES_BY_LOCALE[locale].visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
			);
		} catch (err) {
			console.error({
				message: 'Failed to create visit request',
				error: err,
				info: values,
			});
			toastService.notify({
				title: tText('modules/shared/components/media-card/media-card___er-ging-iets-mis'),
				description: tText(
					'modules/shared/components/media-card/media-card___er-ging-iets-mis-beschrijving'
				),
			});
		}
	};

	const onOpenRequestAccess = () => {
		setQuery({
			[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: maintainerSlug,
		});
		setIsRequestAccessBladeOpen(true);
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
			return (
				<b className={`u-text-ellipsis--${view === 'grid' ? 7 : 3}`}>
					<HighlightSearchTerms
						toHighlight={title ?? ''}
						searchTerms={keywords}
						enabled={!!keywords?.length}
					/>
				</b>
			);
		}

		if (keywords && keywords.length > 0) {
			console.warn('[WARN][MediaCard] Title could not be highlighted.');
		}

		return title;
	};

	const renderDescription = (): ReactNode => {
		if (typeof description === 'string' && keywords) {
			const truncatedText = extractSnippetBySearchTerm(
				description,
				keywords,
				TRUNCATED_TEXT_LENGTH
			);
			return (
				<HighlightSearchTerms
					toHighlight={truncatedText ?? ''}
					searchTerms={keywords}
					enabled={!!keywords?.length}
				/>
			);
		}

		return description;
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

		return (
			<HighlightSearchTerms
				toHighlight={subtitle ?? ''}
				searchTerms={keywords}
				enabled={!!keywords?.length}
			/>
		);
	};

	const renderNoContentIcon = () => {
		return (
			<Icon
				className={clsx(styles['c-media-card__no-content-icon'], styles['c-media-card__icon'], {
					[styles['c-media-card__no-content-icon']]: !link,
				})}
				name={TYPE_TO_NO_ICON_MAP[type as IeObjectType]}
			/>
		);
	};

	const renderDuration = () => (
		<div className={clsx(styles['c-media-card__header-duration'])}>{duration}</div>
	);

	const renderTags = () => {
		return hasRelated && <Badge variants="small" text={<Icon name={IconNamesLight.Link} />} />;
	};

	const renderLocallyAvailablePill = () => {
		if (!showLocallyAvailable) {
			return null;
		}
		return (
			<div className={styles['c-media-card__locally-available-pill']}>
				<Pill
					isExpanded
					icon={IconNamesLight.Forbidden}
					label={tText(
						'modules/shared/components/media-card/media-card___enkel-ter-plaatse-beschikbaar'
					)}
					className="u-bg-black u-color-white"
				/>
			</div>
		);
	};

	const renderNumberOfChildren = () => {
		if (numOfChildren === 0) {
			return;
		}
		return (
			<div className={styles['c-media-card__header__children']}>
				{numOfChildren}{' '}
				{numOfChildren > 1
					? tText('modules/shared/components/media-card/media-card___items')
					: tText('modules/shared/components/media-card/media-card___item')}
			</div>
		);
	};

	const renderImage = (imgPath: string | undefined) => {
		let imagePath: string | undefined = imgPath;
		if (!imagePath) {
			return (
				<div
					className={clsx(
						styles['c-media-card__header'],
						view === 'grid' && styles['c-media-card__header--grid'],
						view === 'list' && styles['c-media-card__header--list'],
						styles['c-media-card__header--no-content']
					)}
				>
					{renderNoContentIcon()}
					{renderNumberOfChildren()}
					{renderLocallyAvailablePill()}
				</div>
			);
		}

		if (type === IeObjectType.Audio || type === IeObjectType.AudioFragment) {
			// Only render the waveform if the thumbnail is available
			// The thumbnail is an ugly speaker icon that we never want to show
			// But if that thumbnail is not available it most likely means this object does not have the BEZOEKERTOOL-CONTENT license
			imagePath = AdminConfigManager.getConfig().components.defaultAudioStill;
		}

		return (
			<div
				className={clsx(
					styles['c-media-card__header'],
					view === 'grid' && styles['c-media-card__header--grid'],
					view === 'list' && styles['c-media-card__header--list']
				)}
			>
				<img src={imagePath} alt={''} width="100%" />
				{!isNil(icon) && (
					<>
						<div className={clsx(styles['c-media-card__header-icon'])}>
							<Icon name={icon} />
						</div>
						{renderLocallyAvailablePill()}
					</>
				)}
				{renderNumberOfChildren()}
				{duration && renderDuration()}
			</div>
		);
	};

	const renderKeyUserPill = () => (
		<div className="u-mt-8">
			<Pill
				icon={IconNamesLight.Key}
				label={tText(
					'modules/shared/components/media-card/media-card___item-bekijken-uit-jouw-sector'
				)}
				className="u-color-black u-bg-mustard"
			/>
		</div>
	);

	const renderPlanVisitButtons = () => (
		<div className={styles['c-media-card__locally-available-container']}>
			<Button
				iconStart={<Icon name={IconNamesLight.Info} />}
				label={tText('modules/shared/components/media-card/media-card___meer-info')}
				variants={['info']}
				className={styles['c-media-card__info-button']}
				onClick={() => setIsInfoModalOpen(true)}
			/>
			<Button
				label={tText('modules/shared/components/media-card/media-card___plan-een-bezoek')}
				variants={['dark']}
				className={styles['c-media-card__visit-button']}
				onClick={() => onOpenRequestAccess()}
			/>
		</div>
	);

	const renderTempAccessPill = () => {
		if (user?.groupName === GroupName.MEEMOO_ADMIN) {
			// Don't show the temporary access label for MEEMOO admins, since they have access to all visitor spaces
			return null;
		}
		if (user?.groupName === GroupName.CP_ADMIN && maintainerSlug === user?.visitorSpaceSlug) {
			// Don't show the temporary access label for CP_ADMIN's own visitor space
			return null;
		}

		return (
			<div className="u-mt-8 ">
				<Pill
					isExpanded
					icon={IconNamesLight.Clock}
					label={tText('modules/shared/components/media-card/media-card___tijdelijke-toegang')}
					className="u-color-black u-bg-lila"
				/>
			</div>
		);
	};

	const classNames = clsx(
		styles['c-media-card'],
		`c-media-card--${type}`,
		!link && 'c-media-card--no-link',
		showKeyUserLabel && styles['c-media-card--key-user']
	);
	const renderCard = () => {
		return (
			<Card
				className={classNames}
				orientation={view === 'grid' ? 'vertical' : 'horizontal--at-md'}
				title={renderTitle()}
				image={renderImage(thumbnail)}
				subtitle={objectId}
				caption={renderCaption()}
				toolbar={renderToolbar()}
				tags={renderTags()}
				padding="both"
				to={link}
				linkComponent={NextLinkWrapper}
				onClick={saveScrollPosition}
			>
				{typeof description === 'string' ? (
					<div className="u-text-ellipsis--2">
						<span>{renderDescription()}</span>
					</div>
				) : (
					renderDescription()
				)}
				{hasTempAccess && renderTempAccessPill()}
				{showKeyUserLabel && renderKeyUserPill()}
				{showPlanVisitButtons && renderPlanVisitButtons()}
			</Card>
		);
	};

	return (
		<div id={id} className={className}>
			{renderCard()}
			<Modal
				title={tText(
					'modules/shared/components/media-card/media-card___waarom-kan-ik-dit-object-niet-bekijken'
				)}
				isOpen={isInfoModalOpen}
				onClose={() => setIsInfoModalOpen(false)}
				footer={
					<div className={styles['c-media-card__close-button-container']}>
						<Button
							label={tText('modules/shared/components/media-card/media-card___sluit')}
							onClick={() => setIsInfoModalOpen(false)}
							variants={['dark']}
							className={styles['c-media-card__close-button']}
						/>
					</div>
				}
			>
				<p className={styles['c-media-card__infomodal-description']}>
					{tText('modules/shared/components/media-card/media-card___geen-licentie')}
				</p>
			</Modal>
			<RequestAccessBlade
				isOpen={isRequestAccessBladeOpen}
				onClose={() => setIsRequestAccessBladeOpen(false)}
				onSubmit={onRequestAccessSubmit}
				id="media-card__request-access-blade"
			/>
		</div>
	);
};

export default MediaCard;

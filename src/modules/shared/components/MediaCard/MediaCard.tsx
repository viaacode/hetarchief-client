import { Badge, Button, Card } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, MouseEvent, ReactNode, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import { VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { extractSnippetBySearchTerm } from '@ie-objects/utils/extract-snippet-by-search-term';
import { DropdownMenu, IconNamesLight, Modal, Pill } from '@shared/components';
import { TRUNCATED_TEXT_LENGTH, TYPE_TO_NO_ICON_MAP } from '@shared/components/MediaCard';
import { ROUTES } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { setLastScrollPosition } from '@shared/store/ui';
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
	publishedOrCreatedDate,
	publishedBy,
	title,
	type,
	view,
	id,
	actions,
	buttons,
	hasRelated,
	icon,
	showKeyUserLabel,
	meemooIdentifier,
	showLocallyAvailable = false,
	link,
	maintainerSlug,
	hasTempAccess,
	previousPage,
}) => {
	const { tText } = useTranslation();
	const router = useRouter();
	const dispatch = useDispatch();

	const [, setQuery] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
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

	const wrapInLink = (children: ReactNode) => {
		if (link && !showLocallyAvailable) {
			return (
				<Link key={id} href={link}>
					<a
						className="u-text-no-decoration"
						aria-label={id}
						onClick={saveScrollPosition}
					>
						{children}
					</a>
				</Link>
			);
		}

		return children;
	};

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
			if (!user || !maintainerSlug) {
				toastService.notify({
					title: tText(
						'modules/shared/components/media-card/media-card___je-bent-niet-ingelogd'
					),
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
				ROUTES.visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
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
		setQuery({ [VISITOR_SPACE_SLUG_QUERY_KEY]: maintainerSlug });
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

	const renderDescription = (): ReactNode => {
		if (typeof description === 'string' && keywords) {
			const truncatedText = extractSnippetBySearchTerm(
				description,
				keywords,
				TRUNCATED_TEXT_LENGTH
			);
			return <>{keywords?.length ? highlighted(truncatedText ?? '') : description}</>;
		}

		return description;
	};

	const renderSubTitle = (): ReactNode => {
		return wrapInLink(meemooIdentifier);
	};

	const renderCaption = (): ReactNode => {
		let subtitle = '';

		if (publishedBy) {
			subtitle += publishedBy;
		}

		if (publishedOrCreatedDate) {
			const formatted = formatMediumDate(publishedOrCreatedDate);

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
				{showLocallyAvailable && renderLocallyAvailablePill()}
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

	const renderLocallyAvailablePill = () => (
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

	const renderImage = (imgPath: string | undefined) =>
		imgPath
			? wrapInLink(
					<>
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
								</>
							)}
							{duration && renderDuration()}
						</div>
					</>
			  )
			: renderNoContent();

	const highlighted = (toHighlight: string) => (
		<Highlighter searchWords={keywords ?? []} autoEscape={true} textToHighlight={toHighlight} />
	);

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

	const renderLocallyAvailableButtons = () => (
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
					label={tText(
						'modules/shared/components/media-card/media-card___tijdelijke-toegang'
					)}
					className="u-color-black u-bg-lila"
				/>
			</div>
		);
	};

	return (
		<div id={id}>
			<Card
				className={clsx(
					styles['c-media-card'],
					showKeyUserLabel && styles['c-media-card--key-user'],
					!showLocallyAvailable && styles['c-media-card--pointer']
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
								<span>{renderDescription()}</span>
							</div>
						)}
						{hasTempAccess && renderTempAccessPill()}
						{showKeyUserLabel && renderKeyUserPill()}
						{showLocallyAvailable && renderLocallyAvailableButtons()}
					</>
				) : (
					<>
						{wrapInLink(renderDescription())}
						{showKeyUserLabel && renderKeyUserPill()}
						{showLocallyAvailable && renderLocallyAvailableButtons()}
					</>
				)}
			</Card>
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
			/>
		</div>
	);
};

export default MediaCard;

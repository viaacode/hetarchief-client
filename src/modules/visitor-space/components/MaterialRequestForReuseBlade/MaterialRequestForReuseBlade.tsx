import { selectUser } from '@auth/store/user';
import type { User } from '@auth/types';
import type { IeObjectFile } from '@ie-objects/ie-objects.types';
import { GET_BLANK_MATERIAL_REQUEST_REUSE_FORM } from '@material-requests/const';
import { useGetMaterialRequestsForMediaItem } from '@material-requests/hooks/get-material-requests-for-media-item';
import { MaterialRequestsService } from '@material-requests/services';
import {
	type MaterialRequest,
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionDigitalOnline,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestGeographicalUsage,
	MaterialRequestIntendedUsage,
	MaterialRequestRequesterCapacity,
	type MaterialRequestReuseForm,
	MaterialRequestTimeUsage,
	MaterialRequestType,
} from '@material-requests/types';
import { Alert, Button, FormControl, TextArea, TimeCropControls } from '@meemoo/react-components';
import { AudioOrVideoPlayer } from '@shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer';
import { Blade } from '@shared/components/Blade/Blade';
import { ConfirmModalBeforeUnload } from '@shared/components/ConfirmModalBeforeUnload';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { renderMobileDesktop } from '@shared/helpers/renderMobileDesktop';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { setMaterialRequestCount, setShowMaterialRequestCenter } from '@shared/store/ui';
import {
	MATERIAL_REQUEST_REUSE_FORM_VALIDATION_SCHEMA,
	type MaterialRequestReuseSettings,
} from '@visitor-space/components/MaterialRequestForReuseBlade/MaterialRequestForReuseBlade.const';
import RadioButtonAccordion from '@visitor-space/components/RadioButtonAccordion/RadioButtonAccordion';
import type { RadioButtonAccordionOption } from '@visitor-space/components/RadioButtonAccordion/RadioButtonAccordion.types';
import clsx from 'clsx';
import { parseISO } from 'date-fns';
import { isNil, kebabCase, noop } from 'lodash-es';
import { useRouter } from 'next/router';
import React, { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DateRangeInput from '../DateRangeInput/DateRangeInput';
import MaterialCard from '../MaterialCard/MaterialCard';
import styles from './MaterialRequestForReuseBlade.module.scss';

interface MaterialRequestForReuseBladeProps {
	isOpen: boolean;
	isEditMode?: boolean;
	onClose: () => void;
	materialRequest: MaterialRequest;
	refetchMaterialRequests?: () => void;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestForReuseBlade: FC<MaterialRequestForReuseBladeProps> = ({
	isOpen,
	isEditMode = false,
	onClose,
	materialRequest,
	refetchMaterialRequests,
	layer,
	currentLayer,
}) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const locale = useLocale();
	const user: User | null = useSelector(selectUser);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only change the default values when the id of the request changes
	const defaultFormValues = useMemo(() => {
		return {
			...GET_BLANK_MATERIAL_REQUEST_REUSE_FORM(),
			...materialRequest.reuseForm,
			representationId: materialRequest.objectRepresentationId,
		};
	}, [materialRequest.id]);

	const [formValues, setFormValues] = useState<MaterialRequestReuseForm>(defaultFormValues);
	const [formErrors, setFormErrors] = useState<
		Partial<Record<keyof MaterialRequestReuseSettings, string | undefined>>
	>({});
	const [isMediaPaused, setIsMediaPaused] = useState(true);
	const [playableFile, setPlayableFile] = useState<IeObjectFile | null>(null);
	const [mediaDuration, setMediaDuration] = useState<number | null>(null);
	const [isRequestSaved, setIsRequestSaved] = useState(false);

	const hasUnsavedChanges = useMemo(() => {
		if (isRequestSaved) {
			return false;
		}
		return isEditMode || JSON.stringify(defaultFormValues) !== JSON.stringify(formValues);
	}, [isRequestSaved, isEditMode, defaultFormValues, formValues]);

	const {
		data: potentialDuplicates,
		isLoading: isLoadingPotentialDuplicates,
		refetch: refetchPotentialDuplicates,
	} = useGetMaterialRequestsForMediaItem(
		materialRequest?.objectSchemaIdentifier,
		!!user?.isKeyUser
	);

	const showDuplicateWarning = useMemo(() => {
		// Still loading the potential duplicates, until then do not show a warning
		if (isLoadingPotentialDuplicates) {
			return false;
		}

		let duplicatesToCheck = potentialDuplicates ? [...potentialDuplicates] : [];

		// When editing we filter out the current request to avoid the validation check to find itself as duplicate
		if (isEditMode) {
			duplicatesToCheck = duplicatesToCheck.filter((item) => item.id !== materialRequest.id);
		}

		// Show a warning if there is already a request for this item with the same cue points and download quality
		return !!duplicatesToCheck?.find(
			(item) =>
				item.type === MaterialRequestType.REUSE &&
				item.reuseForm?.startTime === formValues.startTime &&
				item.reuseForm?.endTime === formValues.endTime &&
				item.reuseForm?.downloadQuality === formValues.downloadQuality
		);
	}, [
		isEditMode,
		potentialDuplicates,
		isLoadingPotentialDuplicates,
		materialRequest,
		formValues.startTime,
		formValues.endTime,
		formValues.downloadQuality,
	]);

	/**
	 * Reset form when the model is opened
	 */
	useEffect(() => {
		if (isOpen) {
			// Not using the materialRequest ensures this happens only when the isOpen has changed
			setFormValues(defaultFormValues);
			setFormErrors({});
			refetchPotentialDuplicates().then(noop);
			setIsRequestSaved(false);
		}
	}, [isOpen, defaultFormValues, refetchPotentialDuplicates]);

	const onCloseModal = () => {
		onClose();
		refetchMaterialRequests?.();
	};

	const setFormValue = (key: keyof MaterialRequestReuseForm, value: unknown) => {
		const newFormValues: Partial<MaterialRequestReuseForm> = { [key]: value };

		if (key === 'distributionType') {
			if (value !== MaterialRequestDistributionType.DIGITAL_ONLINE) {
				newFormValues.distributionTypeDigitalOnline = undefined;
			}
			if (value !== MaterialRequestDistributionType.OTHER) {
				newFormValues.distributionTypeOtherExplanation = undefined;
			}
		} else if (key === 'timeUsageType') {
			if (value !== MaterialRequestTimeUsage.IN_TIME) {
				newFormValues.timeUsageFrom = newFormValues.timeUsageTo = undefined;
			}
		} else if (key === 'geographicalUsage') {
			if (value !== MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL) {
				newFormValues.geographicalUsageDescription = undefined;
			}
		}

		setFormValues((prevState) => ({
			...prevState,
			...newFormValues,
		}));
	};

	const onSuccessCreated = async () => {
		setIsRequestSaved(true);
		const response = await MaterialRequestsService.getAll({
			size: 500,
			isPersonal: true,
			isPending: true,
		});
		dispatch(setMaterialRequestCount(response.items.length));
	};

	const validateFormValues = useCallback(
		async (newFormValues: MaterialRequestReuseForm | undefined): Promise<boolean> => {
			const formErrors = (await validateForm(
				newFormValues,
				MATERIAL_REQUEST_REUSE_FORM_VALIDATION_SCHEMA()
			)) as Partial<Record<keyof MaterialRequestReuseSettings, string | undefined>>;
			if (formErrors) {
				setFormErrors(formErrors);
				return false;
			}

			setFormErrors({});
			return true;
		},
		[]
	);

	const onAddToList = async () => {
		try {
			if (showDuplicateWarning) {
				return;
			}

			const isFormValid = await validateFormValues(formValues);

			if (!isFormValid) {
				return;
			}

			const response = await MaterialRequestsService.create({
				objectSchemaIdentifier: materialRequest.objectSchemaIdentifier,
				objectRepresentationId: materialRequest.objectRepresentationId,
				type: MaterialRequestType.REUSE,
				reason: '',
				requesterCapacity: MaterialRequestRequesterCapacity.OTHER,
				reuseForm: formValues,
			});
			if (response === undefined) {
				onFailedRequest();
				return;
			}
			toastService.notify({
				title: tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___toegevoegd-aan-aanvraaglijst'
				),
				description: tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___verstuur-je-aanvraag-of-zoek-verder-naar-digitaal-erfgoed'
				),
				actionLabel: tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bekijk-je-aanvraaglijst'
				),
				onAction: () => dispatch(setShowMaterialRequestCenter(true)),
			});
			await onSuccessCreated();
			onCloseModal();
		} catch (_err) {
			onFailedRequest();
		}
	};

	const onEditRequest = async () => {
		try {
			if (showDuplicateWarning) {
				return;
			}

			const isFormValid = await validateFormValues(formValues);

			if (!isFormValid) {
				return;
			}

			const response = await MaterialRequestsService.update(materialRequest.id, {
				type: MaterialRequestType.REUSE,
				reason: '',
				requesterCapacity: MaterialRequestRequesterCapacity.OTHER,
				reuseForm: formValues,
			});
			if (response === undefined) {
				onFailedRequest();
				return;
			}
			toastService.notify({
				maxLines: 3,
				title: tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijzigingen-success'
				),
				description: tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijzigingen-toegepast'
				),
			});
			await onSuccessCreated();
			onCloseModal();
		} catch (_err) {
			onFailedRequest();
		}
	};

	const onFailedRequest = () => {
		toastService.notify({
			maxLines: 3,
			title: tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___er-ging-iets-mis'
			),
			description: tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___er-ging-iets-mis-tijdens-het-opslaan'
			),
		});
	};

	const renderTitleHeader = (
		props: Pick<HTMLElement, 'id' | 'className'>,
		title: string,
		removePadding = false
	) => (
		<div {...props} style={removePadding ? { paddingBottom: 0 } : {}}>
			<h6>{title}</h6>
			<h2>
				{tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ik-wil-dit-materiaal-downloaden-en-hergebruiken'
				)}
			</h2>
		</div>
	);

	const renderMaterialInfo = () => (
		<dl
			className={clsx(
				styles['c-request-material-reuse__content'],
				styles['c-request-material-reuse__content-material']
			)}
		>
			<dt className={styles['c-request-material-reuse__content-label']}>
				{tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___materiaal'
				)}
			</dt>
			<dd className={styles['c-request-material-reuse__material']}>
				<MaterialCard
					objectId={materialRequest.objectSchemaIdentifier}
					title={materialRequest.objectSchemaName}
					thumbnail={materialRequest.objectThumbnailUrl}
					hideThumbnail={true}
					orientation="vertical"
					link={`/${ROUTE_PARTS_BY_LOCALE[locale].search}/${materialRequest.maintainerSlug}/${materialRequest.objectSchemaIdentifier}`}
					type={materialRequest.objectDctermsFormat}
					publishedBy={materialRequest.maintainerName}
					publishedOrCreatedDate={materialRequest.objectPublishedOrCreatedDate}
					icon={getIconFromObjectType(materialRequest.objectDctermsFormat, true)}
					withBorder={false}
				/>
			</dd>
		</dl>
	);

	const renderTitle = (props: Pick<HTMLElement, 'id' | 'className'>) => {
		const title = isEditMode
			? tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___pas-je-aanvraag-aan'
				)
			: tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___aanvraag'
				);
		return (
			<div className={styles['c-request-material-reuse__title-container']}>
				{renderMobileDesktop({
					mobile: renderTitleHeader(props, title),
					desktop: (
						<>
							{renderTitleHeader(props, title, true)}
							{renderMaterialInfo()}
						</>
					),
				})}
			</div>
		);
	};

	const renderFooter = () => {
		if (isEditMode) {
			return (
				<div className={styles['c-request-material-reuse__footer-container']}>
					<Button
						label={tText(
							'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___keer-terug'
						)}
						variants={['text']}
						onClick={() => router.back()}
						className={styles['c-request-material-reuse__annuleer-button']}
					/>
					<Button
						label={tText(
							'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijzigingen-opslaan'
						)}
						variants={['text', 'dark']}
						onClick={onEditRequest}
						className={styles['c-request-material-reuse__voeg-toe-button']}
					/>
				</div>
			);
		}
		return (
			<div className={styles['c-request-material-reuse__footer-container']}>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___keer-terug'
					)}
					variants={['text']}
					onClick={() => router.back()}
					className={styles['c-request-material-reuse__annuleer-button']}
				/>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___voeg-toe-aan-aanvraaglijst-zoek-verder'
					)}
					variants={['text', 'dark']}
					onClick={onAddToList}
					className={styles['c-request-material-reuse__voeg-toe-button']}
				/>
			</div>
		);
	};

	const renderDuplicateAlert = (): ReactNode => {
		return (
			<Alert
				className={styles['c-request-material__alert']}
				icon={<Icon name={IconNamesLight.Exclamation} aria-hidden />}
				title={tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___er-bestaat-reeds-een-hergebruiksformulier-met-deze-informatie'
				)}
				content={tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___je-hebt-voor-dit-materiaal-een-formulier-voor-hergebruik-ingevuld-met-exact-dezelfde-vereisten-gelieve-een-ander-fragment-of-een-andere-downloadkwaliteit-te-selecteren'
				)}
			/>
		);
	};

	const setVideoSeekTime = (newTime: number) => {
		const video: HTMLVideoElement | null = document.querySelector(
			'.c-request-material-reuse__content-video-player.c-video-player video'
		) as HTMLVideoElement | null;
		if (video) {
			video.currentTime = newTime;
		}
	};

	const handleMetadataLoaded = (evt: Event) => {
		const duration = (evt?.target as HTMLVideoElement)?.duration;

		setMediaDuration(duration);

		// Prefill the end time if nothing has been set yet (Ensures timecontrols and video are in sync)
		if (isNil(formValues.endTime)) {
			setFormValue('endTime', duration ?? 0);
		}
	};

	const renderVideoSettings = () => {
		if (!materialRequest.objectRepresentation) {
			return null;
		}

		return (
			<div
				className={clsx(
					styles['c-request-material-reuse__content'],
					styles['c-request-material-reuse__content-column']
				)}
			>
				<dl
					className={clsx(
						styles['c-request-material-reuse__content'],
						styles['c-request-material-reuse__content-no-border']
					)}
				>
					<dt className={styles['c-request-material-reuse__content-label']}>
						{tText(
							'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___materiaalselectie'
						)}
					</dt>
					<dd className={styles['c-request-material-reuse__content-value']}>
						{tText(
							'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___materiaalselectie-vraag'
						)}
					</dd>
				</dl>
				<div className={styles['c-request-material-reuse__content-full-width']}>
					<AudioOrVideoPlayer
						className={clsx(
							styles['c-request-material-reuse__content-video-player'],
							'c-request-material-reuse__content-video-player'
						)}
						owner="material request re-uage blade"
						representation={materialRequest.objectRepresentation}
						dctermsFormat={materialRequest.objectDctermsFormat}
						maintainerLogo={
							materialRequest?.maintainerLogo ? materialRequest.maintainerLogo : undefined
						}
						cuePoints={{
							start: formValues.startTime ?? null,
							end: formValues.endTime ?? null,
						}}
						poster={materialRequest.objectThumbnailUrl}
						allowFullScreen={false}
						paused={isMediaPaused}
						onPlay={() => setIsMediaPaused(false)}
						onPause={() => setIsMediaPaused(true)}
						onMediaReady={(_, file) => {
							setPlayableFile(file);

							// Prefill the start time if nothing has been set yet (Ensures timecontrols and video are in sync)
							if (isNil(formValues.startTime)) {
								setFormValue('startTime', 0);
							}
						}}
						onMetadataLoaded={handleMetadataLoaded}
					/>
				</div>
				{playableFile && mediaDuration && (
					<div className={styles['c-request-material-reuse__content-full-width']}>
						<TimeCropControls
							className={styles['c-request-material-reuse__content-time-controls']}
							startTime={formValues.startTime ?? 0}
							endTime={formValues.endTime || mediaDuration}
							minTime={0}
							maxTime={mediaDuration}
							trackColor="#adadad"
							highlightColor="#000"
							// Skip hour formatting if video length is less than an hour
							skipHourFormatting={mediaDuration < 3600}
							correctWrongTimeInput={true}
							allowStartAndEndToBeTheSame={true}
							onChange={(startTime, endTime) => {
								if (startTime !== formValues.startTime) {
									setVideoSeekTime(startTime);
								} else if (endTime !== formValues.endTime) {
									setVideoSeekTime(endTime);
								}

								setFormValue('startTime', startTime);
								setFormValue('endTime', endTime);
							}}
							onError={noop}
						/>
					</div>
				)}
				{(formErrors.startTime || formErrors.endTime) && (
					<div className={styles['c-request-material-reuse__content-full-width']}>
						<RedFormWarning error={formErrors.startTime || formErrors.endTime} />
					</div>
				)}
			</div>
		);
	};

	const renderRadiobuttonGroup = (
		label: string,
		title: string,
		property: keyof MaterialRequestReuseSettings,
		radiobuttonOptions: RadioButtonAccordionOption<unknown>[],
		additionalErrors: (keyof MaterialRequestReuseSettings)[] = []
	) => {
		const foundAdditionalError = additionalErrors.find(
			(errorProperty) => formErrors[errorProperty]
		);

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{label}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={title}
						radioButtonGroupLabel={kebabCase(property)}
						selectedOption={formValues[property]}
						onChange={(value) => setFormValue(property, value)}
						options={radiobuttonOptions}
						error={
							formErrors[property] ||
							(foundAdditionalError ? formErrors[foundAdditionalError] : null)
						}
					/>
				</dd>
			</dl>
		);
	};

	const renderDownloadQuality = () => {
		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-vraag'
			),
			'downloadQuality',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-afspeelkwaliteit-label'
					),
					value: MaterialRequestDownloadQuality.NORMAL,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-afspeelkwaliteit-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-hogere-kwaliteit-label'
					),
					value: MaterialRequestDownloadQuality.HIGH,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-hogere-kwaliteit-omschrijving'
					),
				},
			]
		);
	};

	const renderIntendedUsageDescription = () => {
		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-beschrijving-label'
					)}
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<FormControl
						label={tText(
							'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-beschrijving-vraag'
						)}
						errors={[
							<div className="u-flex" key={`form-error--intendedUsage`}>
								<RedFormWarning error={formErrors.intendedUsageDescription} />
								<span className={styles['c-request-material-reuse__content-value-length']}>
									{formValues.intendedUsageDescription?.length || 0} / 300
								</span>
							</div>,
						]}
					>
						<TextArea
							value={formValues.intendedUsageDescription}
							maxLength={300}
							onChange={(evt) => setFormValue('intendedUsageDescription', evt.target.value)}
						/>
					</FormControl>
				</dd>
			</dl>
		);
	};

	const renderIntendedUsage = () => {
		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-vraag'
			),
			'intendedUsage',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-intern-gebruik-zonder-vergoeding-label'
					),
					value: MaterialRequestIntendedUsage.INTERN,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-intern-gebruik-zonder-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-extern-gebruik-zonder-direct-commercieel-voordeel-label'
					),
					value: MaterialRequestIntendedUsage.NON_COMMERCIAL,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-extern-gebruik-zonder-direct-commercieel-voordeel-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-directe-commerciele-exploitatie-label'
					),
					value: MaterialRequestIntendedUsage.COMMERCIAL,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-directe-commerciele-exploitatie-omschrijving'
					),
				},
			]
		);
	};

	const renderDistributionAccess = () => {
		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-vraag'
			),
			'distributionAccess',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-enkel-binnen-de-organisatie-label'
					),
					value: MaterialRequestDistributionAccess.INTERN,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-enkel-binnen-de-organisatie-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-organisatie-en-externe-gebruikers-label'
					),
					value: MaterialRequestDistributionAccess.INTERN_EXTERN,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-organisatie-en-externe-gebruikers-omschrijving'
					),
				},
			]
		);
	};

	const renderDistributionType = () => {
		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-vraag'
			),
			'distributionType',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-een-vast-medium-label'
					),
					value: MaterialRequestDistributionType.DIGITAL_OFFLINE,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-een-vast-medium-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-label'
					),
					value: MaterialRequestDistributionType.DIGITAL_ONLINE,
					openOnSelect: true,
					description: (
						<RadioButtonAccordion
							title=""
							radioButtonGroupLabel={kebabCase('distributionTypeDigitalOnline')}
							selectedOption={formValues.distributionTypeDigitalOnline}
							onChange={(value) => setFormValue('distributionTypeDigitalOnline', value)}
							options={[
								{
									label: tText(
										'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-een-besloten-dienst-label'
									),
									value: MaterialRequestDistributionDigitalOnline.INTERNAL,
									disabled:
										formValues.distributionType !== MaterialRequestDistributionType.DIGITAL_ONLINE,
									description: tText(
										'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-een-besloten-dienst-omschrijving'
									),
								},
								{
									label: tText(
										'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-publiek-zonder-authenticatie-label'
									),
									value: MaterialRequestDistributionDigitalOnline.NO_AUTH,
									disabled:
										formValues.distributionType !== MaterialRequestDistributionType.DIGITAL_ONLINE,
									description: tText(
										'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-publiek-zonder-authenticatie-omschrijving'
									),
								},
								{
									label: tText(
										'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-publiek-met-authenticatie-label'
									),
									value: MaterialRequestDistributionDigitalOnline.WITH_AUTH,
									disabled:
										formValues.distributionType !== MaterialRequestDistributionType.DIGITAL_ONLINE,
									description: tText(
										'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-publiek-met-authenticatie-omschrijving'
									),
								},
							]}
						/>
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-andere-label'
					),
					value: MaterialRequestDistributionType.OTHER,
					openOnSelect: true,
					description: (
						<>
							{tHtml(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-andere-omschrijving'
							)}
							<FormControl
								className={clsx(styles['c-request-material-reuse__content-value-extra-padding'])}
							>
								<TextArea
									value={formValues.distributionTypeOtherExplanation}
									disabled={formValues.distributionType !== MaterialRequestDistributionType.OTHER}
									onChange={(evt) =>
										setFormValue('distributionTypeOtherExplanation', evt.target.value)
									}
								/>
							</FormControl>
						</>
					),
				},
			],
			['distributionTypeDigitalOnline', 'distributionTypeOtherExplanation']
		);
	};

	const renderMaterialEditing = () => {
		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-vraag'
			),
			'materialEditing',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-geen-wijzigingen-label'
					),
					value: MaterialRequestEditing.NONE,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-geen-wijzigingen-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-de-organisatie-zal-het-bronmateriaal-wijzigen-label'
					),
					value: MaterialRequestEditing.WITH_CHANGES,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-de-organisatie-zal-het-bronmateriaal-wijzigen-omschrijving'
					),
				},
			]
		);
	};

	const renderGeographicalUsage = () => {
		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-vraag'
			),
			'geographicalUsage',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-integraal-gericht-op-vlaamse-of-belgische-markt-label'
					),
					value: MaterialRequestGeographicalUsage.COMPLETELY_LOCAL,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-integraal-gericht-op-vlaamse-of-belgische-markt-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-niet-integraal-gericht-op-vlaamse-of-belgische-markt-label'
					),
					openOnSelect: true,
					value: MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL,
					description: (
						<>
							{tHtml(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-niet-integraal-gericht-op-vlaamse-of-belgische-markt-omschrijving'
							)}
							<FormControl
								className={clsx(styles['c-request-material-reuse__content-value-extra-padding'])}
							>
								<TextArea
									value={formValues.geographicalUsageDescription}
									disabled={
										formValues.geographicalUsage !==
										MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL
									}
									onChange={(evt) => setFormValue('geographicalUsageDescription', evt.target.value)}
								/>
							</FormControl>
						</>
					),
				},
			]
		);
	};

	const renderTimeUsage = () => {
		const from = formValues.timeUsageFrom ? parseISO(formValues.timeUsageFrom) : undefined;
		const to = formValues.timeUsageTo ? parseISO(formValues.timeUsageTo) : undefined;

		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-vraag'
			),
			'timeUsageType',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-onbeperkt-label'
					),
					value: MaterialRequestTimeUsage.UNLIMITED,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-onbeperkt-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-beperkte-periode-label'
					),
					value: MaterialRequestTimeUsage.IN_TIME,
					openOnSelect: true,
					description: (
						<>
							{tHtml(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-beperkte-periode-omschrijving'
							)}
							<FormControl
								className={clsx(styles['c-request-material-reuse__content-value-extra-padding'])}
							>
								<DateRangeInput
									showLabels={true}
									from={from}
									to={to}
									id="timeUsage"
									disabled={formValues.timeUsageType !== MaterialRequestTimeUsage.IN_TIME}
									onChange={(newFromDate: Date | undefined, newToDate: Date | undefined) => {
										setFormValue('timeUsageFrom', newFromDate?.toISOString());
										setFormValue('timeUsageTo', newToDate?.toISOString());
									}}
								/>
							</FormControl>
						</>
					),
				},
			],
			['timeUsageFrom', 'timeUsageTo']
		);
	};

	const renderCopyrightHandling = () => {
		return renderRadiobuttonGroup(
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-label'
			),
			tText(
				'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-vraag'
			),
			'copyrightDisplay',
			[
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-gelijktijdig-met-object-label'
					),
					value: MaterialRequestCopyrightDisplay.SAME_TIME_WITH_OBJECT,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-gelijktijdig-met-object-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-vermelding-bij-object-niet-noodzakelijk-gelijktijdig-label'
					),
					value: MaterialRequestCopyrightDisplay.AROUND_OBJECT,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-vermelding-bij-object-niet-noodzakelijk-gelijktijdig-omschrijving'
					),
				},
				{
					label: tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-geen-vermelding-label'
					),
					value: MaterialRequestCopyrightDisplay.NONE,
					description: tHtml(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-geen-vermelding-omschrijving'
					),
				},
			]
		);
	};

	const renderOtherOptionsNotDeterminingDuplicates = () => {
		if (showDuplicateWarning) {
			return null;
		}

		return (
			<>
				{renderIntendedUsage()}
				{renderIntendedUsageDescription()}
				{renderDistributionAccess()}
				{renderDistributionType()}
				{renderMaterialEditing()}
				{renderGeographicalUsage()}
				{renderTimeUsage()}
				{renderCopyrightHandling()}
			</>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={renderTitle}
			onClose={onCloseModal}
			layer={layer}
			currentLayer={currentLayer}
			className={styles['c-request-material-reuse']}
			isManaged
			id="material-request-blade-reuse"
			extraWide={true}
			headerBackground="platinum"
		>
			{isOpen && (
				<>
					<div className={styles['c-request-material-reuse__content-container']}>
						<div className={styles['c-request-material-reuse__content-form']}>
							{renderMobileDesktop({
								mobile: renderMaterialInfo(),
								desktop: null,
							})}
							{renderVideoSettings()}
							{renderDownloadQuality()}
							{renderOtherOptionsNotDeterminingDuplicates()}
							{showDuplicateWarning && renderDuplicateAlert()}
						</div>
						{renderFooter()}
					</div>
					<ConfirmModalBeforeUnload
						when={hasUnsavedChanges}
						message={tText(
							'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ben-je-zeker-dat-je-dit-venster-wilt-sluiten-hiermee-gaat-de-voortgang-verloren-en-wordt-het-object-niet-toegevoegd-aan-jouw-aanvraaglijst-als-je-verder-werkt-en-het-toevoegt-aan-je-aanvraaglijst-kan-je-het-nadien-nog-aanpassen'
						)}
					/>
				</>
			)}
		</Blade>
	);
};

import { selectUser } from '@auth/store/user';
import type { User } from '@auth/types';
import { IE_OBJECT_INTRA_CP_LICENSES } from '@ie-objects/ie-objects.consts';
import { MediaActions } from '@ie-objects/ie-objects.types';
import { mapDcTermsFormatToSimpleType } from '@ie-objects/utils/map-dc-terms-format-to-simple-type';
import { useGetMaterialRequestsForMediaItem } from '@material-requests/hooks/get-material-requests-for-media-item';
import { MaterialRequestsService } from '@material-requests/services';
import {
	type MaterialRequest,
	MaterialRequestRequesterCapacity,
	MaterialRequestType,
} from '@material-requests/types';
import { Alert, Button, RadioButton, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { renderMobileDesktop } from '@shared/helpers/renderMobileDesktop';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { setMaterialRequestCount, setShowMaterialRequestCenter } from '@shared/store/ui';
import { SimpleIeObjectType } from '@shared/types/ie-objects';
import clsx from 'clsx';
import { intersection, noop } from 'lodash-es';
import React, { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import MaterialCard from '../MaterialCard/MaterialCard';
import styles from './MaterialRequestBlade.module.scss';

interface MaterialRequestBladeProps {
	isOpen: boolean;
	isEditMode?: boolean;
	onClose: (shouldTriggerComplexReuseFlow: boolean) => void;
	materialRequest: MaterialRequest;
	refetchMaterialRequests?: () => void;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestBlade: FC<MaterialRequestBladeProps> = ({
	isOpen,
	isEditMode = false,
	onClose,
	materialRequest,
	refetchMaterialRequests,
	layer,
	currentLayer,
}) => {
	const {
		id: materialRequestId,
		objectSchemaName: objectName,
		objectDctermsFormat,
		objectSchemaIdentifier,
		objectLicences,
		objectThumbnailUrl,
		objectPublishedOrCreatedDate,
		objectRepresentationId,
		type,
		reason,
		reuseForm,
		maintainerSlug,
		maintainerName,
	} = materialRequest;
	const dispatch = useDispatch();
	const locale = useLocale();
	const user: User | null = useSelector(selectUser);
	const simpleType = mapDcTermsFormatToSimpleType(objectDctermsFormat);
	const triggerComplexReuseFlow =
		(simpleType === SimpleIeObjectType.AUDIO || simpleType === SimpleIeObjectType.VIDEO) &&
		!!user?.isKeyUser &&
		intersection(objectLicences, IE_OBJECT_INTRA_CP_LICENSES).length > 0;
	// We have a representation, so we know the user is allowed to see this
	const hideViewTypeOption = !!user?.isKeyUser && !!objectRepresentationId;

	const [typeSelected, setTypeSelected] = useState<MaterialRequestType | undefined>(type);
	const [reasonInputValue, setReasonInputValue] = useState(reason || '');
	const [noTypeSelectedOnSave, setNoTypeSelectedOnSave] = useState(false);
	const [showConfirmTypeEdit, setShowConfirmTypeEdit] = useState(false);

	const [, setActiveBlade] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_BLADE,
		withDefault(StringParam, undefined)
	);

	const {
		data: potentialDuplicates,
		isLoading: isLoadingPotentialDuplicates,
		refetch: refetchPotentialDuplicates,
	} = useGetMaterialRequestsForMediaItem(objectSchemaIdentifier, !!user?.isKeyUser);

	const showDuplicateWarning = useMemo(() => {
		// Still loading the potential duplicates, until then do not show a warning
		if (isLoadingPotentialDuplicates) {
			return false;
		}

		// When the selected type is for re-usage and we need the more complex flow with additional information needed to be filled in
		// Validation on duplicates depends on said information (cue points of the media, download quality, ...)
		if (typeSelected === MaterialRequestType.REUSE && triggerComplexReuseFlow) {
			return false;
		}

		let duplicatesToCheck = potentialDuplicates ? [...potentialDuplicates] : [];

		// When editing we filter out the current request to avoid the validation check to find itself as duplicate
		if (isEditMode) {
			duplicatesToCheck = duplicatesToCheck.filter((item) => item.id !== materialRequestId);
		}

		// Show a warning if there is already a request for this item with the same type as the selected type
		return !!duplicatesToCheck?.find(
			(item) =>
				item.type === typeSelected &&
				// Adding fallback values since sometimes it can happen we have an empty string and undefined
				(item.objectRepresentationId || '') === (objectRepresentationId || '')
		);
	}, [
		isEditMode,
		potentialDuplicates,
		typeSelected,
		isLoadingPotentialDuplicates,
		triggerComplexReuseFlow,
		materialRequestId,
		objectRepresentationId,
	]);

	const showReuseFormWarning = useMemo(
		() => isEditMode && type === MaterialRequestType.REUSE && !!reuseForm,
		[isEditMode, type, reuseForm]
	);

	/**
	 * Reset form when the model is opened
	 */
	useEffect(() => {
		if (isOpen) {
			setReasonInputValue(reason || '');
			setTypeSelected(type);
			setNoTypeSelectedOnSave(false);
			refetchPotentialDuplicates().then(noop);
		}
	}, [isOpen, reason, type, refetchPotentialDuplicates]);

	const onCloseModal = (shouldTriggerComplexReuseFlow: boolean) => {
		onClose(shouldTriggerComplexReuseFlow);
		setReasonInputValue('');
		setTypeSelected(undefined);
		setNoTypeSelectedOnSave(false);
		refetchMaterialRequests?.();
	};

	const onSuccessCreated = async () => {
		const response = await MaterialRequestsService.getAll({
			isPersonal: true,
			size: 500,
			isPending: true,
		});
		dispatch(setMaterialRequestCount(response.items.length));
	};

	const onAddToList = async () => {
		try {
			if (!typeSelected) {
				setNoTypeSelectedOnSave(true);
				return;
			}
			setNoTypeSelectedOnSave(false);

			if (showDuplicateWarning) {
				return;
			}

			if (typeSelected === MaterialRequestType.REUSE && triggerComplexReuseFlow) {
				setActiveBlade(MediaActions.RequestMaterialForReuse);
				return;
			}

			const response = await MaterialRequestsService.create({
				objectSchemaIdentifier,
				objectRepresentationId,
				type: typeSelected,
				reason: reasonInputValue,
				requesterCapacity: MaterialRequestRequesterCapacity.OTHER,
			});
			if (response === undefined) {
				onFailedRequest();
				return;
			}
			toastService.notify({
				maxLines: 3,
				title: tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___succes'
				),
				description: tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___rond-je-aanvragenlijst-af'
				),
			});
			await onSuccessCreated();
			//Reuse form already triggered before creation
			onCloseModal(false);
		} catch (_err) {
			onFailedRequest();
		}
	};

	const doEditRequest = async () => {
		try {
			setShowConfirmTypeEdit(false);

			const response = await MaterialRequestsService.update(materialRequestId, {
				type: typeSelected as MaterialRequestType,
				reason: reasonInputValue,
				requesterCapacity: MaterialRequestRequesterCapacity.OTHER,
				reuseForm,
			});
			if (response === undefined) {
				onFailedRequest();
				return;
			}

			const shouldTriggerReuseForm =
				typeSelected === MaterialRequestType.REUSE && triggerComplexReuseFlow;

			if (!shouldTriggerReuseForm) {
				toastService.notify({
					maxLines: 3,
					title: tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___wijzigingen-succes'
					),
					description: tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___wijzigingen-toegepast'
					),
				});
			}
			await onSuccessCreated();
			onCloseModal(shouldTriggerReuseForm);
		} catch (_err) {
			onFailedRequest();
		}
	};

	const onEditRequest = async () => {
		if (!materialRequestId) {
			onFailedRequest();
		} else {
			try {
				if (!typeSelected) {
					setNoTypeSelectedOnSave(true);
					return;
				}
				setNoTypeSelectedOnSave(false);

				if (showDuplicateWarning) {
					return;
				}

				if (showReuseFormWarning && typeSelected !== MaterialRequestType.REUSE) {
					setShowConfirmTypeEdit(true);
				} else {
					await doEditRequest();
				}
			} catch (_err) {
				onFailedRequest();
			}
		}
	};

	const onFailedRequest = () => {
		toastService.notify({
			maxLines: 3,
			title: tText(
				'modules/visitor-space/components/material-request-blade/material-request-blade___er-ging-iets-mis'
			),
			description: tText(
				'modules/visitor-space/components/material-request-blade/material-request-blade___er-ging-iets-mis-tijdens-het-opslaan'
			),
		});
	};

	const renderTitle = (props: Pick<HTMLElement, 'id' | 'className'>) => {
		const title = isEditMode
			? tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___pas-je-aanvraag-aan'
				)
			: tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe'
				);

		return (
			<div className={styles['c-request-material__title-container']}>
				<h2 {...props} style={{ paddingBottom: 0 }}>
					{title}
				</h2>
				<MaterialRequestInformation />
			</div>
		);
	};

	const renderFooter = () => {
		if (isEditMode) {
			return (
				<div className={styles['c-request-material__footer-container']}>
					<Button
						label={tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___wijzigingen-opslaan'
						)}
						variants={['block', 'text']}
						onClick={onEditRequest}
						className={styles['c-request-material__verstuur-button']}
					/>

					<Button
						label={tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
						)}
						variants={['block', 'text']}
						onClick={() => onCloseModal(false)}
						className={styles['c-request-material__annuleer-button']}
					/>
				</div>
			);
		}

		const addButtonLabel = (isMobile: boolean) => {
			if (typeSelected === MaterialRequestType.REUSE && triggerComplexReuseFlow) {
				return isMobile
					? tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___vul-bijkomende-informatie-aan-mobile'
						)
					: tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___vul-bijkomende-informatie-aan'
						);
			}

			return isMobile
				? tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek-mobile'
					)
				: tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek'
					);
		};

		return (
			<div className={styles['c-request-material__footer-container']}>
				{/* ARC-1188: requested to hide single material request button
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___verstuur'
					)}
					variants={['block', 'text']}
					onClick={onCloseModal}
					className={styles['c-request-material__verstuur-button']}
				/> */}
				{noTypeSelectedOnSave ? (
					<RedFormWarning
						error={tHtml(
							'modules/visitor-space/components/material-request-blade/material-request-blade___er-staan-fouten-in-dit-formulier-corrigeer-deze-en-probeer-het-opnieuw'
						)}
					/>
				) : null}
				{renderMobileDesktop({
					mobile: (
						<Button
							label={addButtonLabel(true)}
							variants={['block', 'text', 'dark']}
							onClick={onAddToList}
							className={styles['c-request-material__voeg-toe-button']}
						/>
					),
					desktop: (
						<Button
							label={addButtonLabel(false)}
							variants={['block', 'text', 'dark']}
							onClick={onAddToList}
							className={styles['c-request-material__voeg-toe-button']}
						/>
					),
				})}
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={() => onCloseModal(false)}
					className={styles['c-request-material__annuleer-button']}
				/>
			</div>
		);
	};

	const renderDuplicateAlertContent = (): ReactNode => {
		return (
			<>
				<p>
					{tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___je-hebt-al-op-dit-materiaal-al-een-aanvraag-van-dit-type-ingediend-je-kan-wachten-op-de-behandeling-van-deze-aanvraag-of-ze-nog-annuleren-indien-de-aanbieder-ze-nog-niet-bekeken-heeft'
					)}
				</p>
				<Button
					className="u-py-0 u-px-0 u-height-auto"
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___ga-naar-mijn-aanvraaglijst'
					)}
					variants={['text', 'underline']}
					onClick={() => {
						onCloseModal(false);
						dispatch(setShowMaterialRequestCenter(true));
					}}
				/>
			</>
		);
	};

	const renderDuplicateAlert = (): ReactNode => {
		return (
			<Alert
				className={styles['c-request-material__alert']}
				icon={<Icon name={IconNamesLight.Exclamation} aria-hidden />}
				title={tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___aanvraag-reeds-in-behandeling'
				)}
				content={renderDuplicateAlertContent()}
			/>
		);
	};

	const renderReason = () => {
		// No type selected, so no input to show
		// Duplicate detected, so no input to show
		if (!typeSelected || showDuplicateWarning) {
			return null;
		}

		// We have the complex reuse flow so no reason needed
		if (triggerComplexReuseFlow && typeSelected === MaterialRequestType.REUSE) {
			return null;
		}

		return (
			<>
				<dt className={styles['c-request-material__content-label']}>
					<label htmlFor="reason-input">
						{tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___reden-van-aanvraag'
						)}
					</label>
				</dt>
				<dd className={styles['c-request-material__content-value']}>
					<TextArea
						id="reason-input"
						className={styles['c-request-material__reason-input']}
						onChange={(e) => setReasonInputValue(e.target.value)}
						value={reasonInputValue}
					/>
				</dd>
			</>
		);
	};

	const renderReuseFormAlert = (): ReactNode => {
		return (
			<Alert
				className={styles['c-request-material__alert']}
				icon={<Icon name={IconNamesLight.Exclamation} aria-hidden />}
				title={tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___hergebruikformulier-is-ingevuld'
				)}
				content={renderReuseFormAlertContent()}
			/>
		);
	};

	const renderReuseFormAlertContent = (): ReactNode => {
		return (
			<>
				<p>
					{tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___je-hebt-al-op-dit-materiaal-een-formulier-voor-hergebruik-ingevuld-als-je-het-type-aanvraag-verandert-zal-de-informatie-in-dit-formulier-onherroepelijk-verwijderd-worden-je-kan-de-inhoud-van-het-formulier-aanpassen-door-op-de-onderstaande-link-te-klikken'
					)}
				</p>
				<Button
					className="u-py-0 u-px-0 u-height-auto"
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___ga-naar-het-formulier'
					)}
					variants={['text', 'underline']}
					onClick={() => onCloseModal(true)}
				/>
			</>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={renderTitle}
			footer={isOpen && renderFooter()}
			onClose={() => onCloseModal(false)}
			layer={layer}
			currentLayer={currentLayer}
			className={styles['c-request-material']}
			isManaged
			id="material-request-blade"
		>
			<MaterialCard
				className={styles['c-request-material__material']}
				objectId={objectSchemaIdentifier}
				title={objectName}
				orientation={objectThumbnailUrl ? 'horizontal' : 'vertical'}
				thumbnail={objectThumbnailUrl}
				link={`/${ROUTE_PARTS_BY_LOCALE[locale].search}/${maintainerSlug}/${objectSchemaIdentifier}`}
				type={objectDctermsFormat}
				publishedBy={maintainerName}
				publishedOrCreatedDate={objectPublishedOrCreatedDate}
				icon={getIconFromObjectType(objectDctermsFormat, !!materialRequest.objectRepresentationId)}
			/>
			<div className={styles['c-request-material__content']}>
				<dl>
					<dt className={styles['c-request-material__content-label']}>
						{/* biome-ignore lint/a11y/noLabelWithoutControl: radio buttons reference this label */}
						<label id="radio-group-label">
							{tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___selecteer-een-type'
							)}
						</label>
					</dt>
					<dd
						className={clsx(
							styles['c-request-material__content-value'],
							styles['c-request-material__radio-buttons-container']
						)}
					>
						{!hideViewTypeOption && (
							<RadioButton
								aria-label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___view-aria-label'
								)}
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___view'
								)}
								checked={typeSelected === MaterialRequestType.VIEW}
								onClick={() => setTypeSelected(MaterialRequestType.VIEW)}
							/>
						)}
						<RadioButton
							aria-label={tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___reuse-aria-label'
							)}
							className={styles['c-request-material__radio-button']}
							label={tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___reuse'
							)}
							checked={typeSelected === MaterialRequestType.REUSE}
							onClick={() => setTypeSelected(MaterialRequestType.REUSE)}
						/>
						<RadioButton
							aria-label={tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___more-info-aria-label'
							)}
							className={styles['c-request-material__radio-button']}
							label={tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___more-info'
							)}
							checked={typeSelected === MaterialRequestType.MORE_INFO}
							onClick={() => setTypeSelected(MaterialRequestType.MORE_INFO)}
						/>
						{noTypeSelectedOnSave ? (
							<RedFormWarning
								error={tHtml(
									'modules/visitor-space/components/material-request-blade/material-request-blade___type-verplicht-error'
								)}
							/>
						) : null}
					</dd>
					{renderReason()}
					{showReuseFormWarning && renderReuseFormAlert()}
					{showDuplicateWarning && renderDuplicateAlert()}
				</dl>
			</div>
			<ConfirmationModal
				text={{
					description: tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___je-hebt-al-op-dit-materiaal-een-formulier-voor-hergebruik-ingevuld-als-je-het-type-aanvraag-verandert-zal-de-informatie-in-dit-formulier-onherroepelijk-verwijderd-worden'
					),
					yes: tHtml(
						'modules/visitor-space/components/material-request-blade/material-request-blade___type-aanvraag-wijzigen'
					),
					no: tHtml(
						'modules/visitor-space/components/material-request-blade/material-request-blade___annuleren'
					),
				}}
				fullWidthButtonWrapper
				isOpen={showConfirmTypeEdit}
				onClose={() => setShowConfirmTypeEdit(false)}
				onCancel={() => setShowConfirmTypeEdit(false)}
				onConfirm={doEditRequest}
			/>
		</Blade>
	);
};

import { MaterialRequestsService } from '@material-requests/services';
import {
	type MaterialRequest,
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionDigitalOnline,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestExploitation,
	MaterialRequestGeographicalUsage,
	MaterialRequestRequesterCapacity,
	type MaterialRequestReuseForm,
	MaterialRequestTimeUsage,
	MaterialRequestType,
} from '@material-requests/types';
import { Button, FormControl, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { setMaterialRequestCount } from '@shared/store/ui';
import {
	MATERIAL_REQUEST_REUSE_FORM_VALIDATION_SCHEMA,
	type MaterialRequestReuseSettings,
} from '@visitor-space/components/MaterialRequestForReuseBlade/MaterialRequestForReuseBlade.const';
import RadioButtonAccordion from '@visitor-space/components/RadioButtonAccordion/RadioButtonAccordion';
import type { RadioButtonAccordionOption } from '@visitor-space/components/RadioButtonAccordion/RadioButtonAccordion.types';
import clsx from 'clsx';
import { parseISO } from 'date-fns';
import { kebabCase } from 'lodash-es';
import { useRouter } from 'next/router';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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

	const [formValues, setFormValues] = useState<MaterialRequestReuseForm>({
		...materialRequest.reuseForm,
	});
	const [formErrors, setFormErrors] = useState<
		Partial<Record<keyof MaterialRequestReuseSettings, string | undefined>>
	>({});

	/**
	 * Reset form when the model is opened
	 */
	useEffect(() => {
		if (isOpen) {
			setFormValues({ ...materialRequest.reuseForm });
			setFormErrors({});
		}
	}, [isOpen, materialRequest]);

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
		}

		setFormValues((prevState) => ({
			...prevState,
			...newFormValues,
		}));
	};

	const onSuccessCreated = async () => {
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
			const isFormValid = await validateFormValues(formValues);

			if (!isFormValid) {
				return;
			}

			const response = await MaterialRequestsService.create({
				objectSchemaIdentifier: materialRequest.objectSchemaIdentifier,
				type: MaterialRequestType.REUSE,
				reason: '',
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
			onCloseModal();
		} catch (_err) {
			onFailedRequest();
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
		const title = isEditMode ? tText('Pas je aanvraag aan') : tText('Aanvraag');

		return (
			<div className={styles['c-request-material-reuse__title-container']}>
				<div {...props} style={{ paddingBottom: 0 }}>
					<h6>{title}</h6>
					<h2>{tText('Ik wil dit materiaal downloaden en hergebruiken')}</h2>
				</div>
				<dl className={styles['c-request-material-reuse__content']}>
					<dt className={styles['c-request-material-reuse__content-label']}>
						{tText('Materiaal')}
					</dt>
					<dd style={{ width: '100%' }}>
						<MaterialCard
							className={styles['c-request-material-reuse__material']}
							objectId={materialRequest.objectSchemaIdentifier}
							title={materialRequest.objectSchemaName}
							thumbnail={materialRequest.objectThumbnailUrl}
							hideThumbnail={true}
							link={`/${ROUTE_PARTS_BY_LOCALE[locale].search}/${materialRequest.maintainerSlug}/${materialRequest.objectSchemaIdentifier}`}
							type={materialRequest.objectDctermsFormat}
							publishedBy={materialRequest.maintainerName}
							publishedOrCreatedDate={materialRequest.objectPublishedOrCreatedDate}
							icon={getIconFromObjectType(materialRequest.objectDctermsFormat, true)}
							withBorder={false}
						/>
					</dd>
				</dl>
			</div>
		);
	};

	const renderFooter = () => {
		return (
			<div className={styles['c-request-material-reuse__footer-container']}>
				<Button
					label={tText('Keer terug')}
					variants={['text']}
					onClick={() => router.back()}
					className={styles['c-request-material-reuse__annuleer-button']}
				/>
				<Button
					label={tText('Voeg toe aan aanvraaglijst & zoek verder')}
					variants={['text', 'dark']}
					onClick={onAddToList}
					className={styles['c-request-material-reuse__voeg-toe-button']}
				/>
			</div>
		);
	};

	const renderVideoSettings = () => {
		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{tText('Materiaalselectie')}
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>TODO: VIDEO</dd>
			</dl>
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
			tText('Downloadkwaliteit label'),
			tText('Downloadkwaliteit subtitel'),
			'downloadQuality',
			[
				{
					label: tText('Afspeelkwaliteit'),
					value: MaterialRequestDownloadQuality.NORMAL,
					description: tHtml('Afspeelkwaliteit omschrijving'),
				},
				{
					label: tText('Hogere kwaliteit'),
					value: MaterialRequestDownloadQuality.HIGH,
					description: tHtml('Hogere kwaliteit omschrijving'),
				},
			]
		);
	};

	const renderIntendedUsage = () => {
		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{tText('Bedoeld gebruik label')}
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<FormControl
						label={tText('Bedoeld gebruik subtitel')}
						errors={[
							<div className="u-flex" key={`form-error--intendedUsage`}>
								<RedFormWarning error={formErrors.intendedUsage} />
								<span className={styles['c-request-material-reuse__content-value-length']}>
									{formValues.intendedUsage?.length || 0} / 300
								</span>
							</div>,
						]}
					>
						<TextArea
							value={formValues.intendedUsage}
							maxLength={300}
							onChange={(evt) => setFormValue('intendedUsage', evt.target.value)}
						/>
					</FormControl>
				</dd>
			</dl>
		);
	};

	const renderExploitation = () => {
		return renderRadiobuttonGroup(
			tText('Commerciële exploitatie label'),
			tText('Commerciële exploitatie subtitel'),
			'exploitation',
			[
				{
					label: tText('Interne exploitatie zonder verdere vergoeding'),
					value: MaterialRequestExploitation.INTERN,
					description: tHtml('Interne exploitatie omschrijving'),
				},
				{
					label: tText('Niet-commerciële exploitatie'),
					value: MaterialRequestExploitation.NON_COMMERCIAL,
					description: tHtml('Niet-commerciële exploitatie omschrijving'),
				},
				{
					label: tText('Indirecte commerciële exploitatie'),
					value: MaterialRequestExploitation.INDIRECT_COMMERCIAL,
					description: tHtml('Indirecte commerciële exploitatie omschrijving'),
				},
				{
					label: tText('Directe commerciële exploitatie'),
					value: MaterialRequestExploitation.COMMERCIAL,
					description: tHtml('Directe commerciële exploitatie omschrijving'),
				},
			]
		);
	};

	const renderDistributionAccess = () => {
		return renderRadiobuttonGroup(
			tText('Verspreiding materiaal label'),
			tText('Verspreiding materiaal subtitel'),
			'distributionAccess',
			[
				{
					label: tText('Enkel binnen de organisatie'),
					value: MaterialRequestDistributionAccess.INTERN,
					description: tHtml('Enkel binnen de organisatie omschrijving'),
				},
				{
					label: tText('Organisatie en externe gebruikers'),
					value: MaterialRequestDistributionAccess.INTERN_EXTERN,
					description: tHtml('Organisatie en externe gebruikers omschrijving'),
				},
			]
		);
	};

	const renderDistributionType = () => {
		return renderRadiobuttonGroup(
			tText('Type verspreiding label'),
			tText('Type verspreiding subtitel'),
			'distributionType',
			[
				{
					label: tText(
						'Enkel analoge (fysieke) exemplaren zonder digitale verspreiding (bv. papieren prints, posters)'
					),
					value: MaterialRequestDistributionType.ANALOG,
					description: tHtml('Enkel analoog omschrijving'),
				},
				{
					label: tText('Digitale ontsluiting via een vast medium'),
					value: MaterialRequestDistributionType.DIGITAL_OFFLINE,
					description: tHtml('Digitale ontsluiting via een vast medium omschrijving'),
				},
				{
					label: tText('Digitale ontsluiting via netwerkverbinding'),
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
									label: tText('Publiek zonder authenticatie'),
									value: MaterialRequestDistributionDigitalOnline.NO_AUTH,
									description: tText('Publiek zonder authenticatie omschrijving'),
								},
								{
									label: tText('Publiek met authenticatie'),
									value: MaterialRequestDistributionDigitalOnline.WITH_AUTH,
									description: tText('Publiek met authenticatie omschrijving'),
								},
							]}
						/>
					),
				},
				{
					label: tText('Andere, namelijk:'),
					value: MaterialRequestDistributionType.OTHER,
					openOnSelect: true,
					description: (
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
					),
				},
			],
			['distributionTypeDigitalOnline', 'distributionTypeOtherExplanation']
		);
	};

	const renderMaterialEditing = () => {
		return renderRadiobuttonGroup(
			tText('Wijziging materiaal label'),
			tText('Wijziging materiaal subtitel'),
			'materialEditing',
			[
				{
					label: tText('Geen wijzigingen'),
					value: MaterialRequestEditing.NONE,
					description: tHtml('Geen wijzigingen omschrijving'),
				},
				{
					label: tText('De organisatie zal het bronmateriaal wijzigen'),
					value: MaterialRequestEditing.WITH_CHANGES,
					description: tHtml('De organisatie zal het bronmateriaal wijzigen omschrijving'),
				},
			]
		);
	};

	const renderGeographicalUsage = () => {
		return renderRadiobuttonGroup(
			tText('Geografisch gebruik label'),
			tText('Geografisch gebruik subtitel'),
			'geographicalUsage',
			[
				{
					label: tText('Integraal gericht op Vlaamse of Belgische markt'),
					value: MaterialRequestGeographicalUsage.COMPLETELY_LOCAL,
					description: tHtml('Integraal gericht op Vlaamse of Belgische markt omschrijving'),
				},
				{
					label: tText('Niet integraal gericht op Vlaamse of Belgische markt'),
					value: MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL,
					description: tHtml('Niet integraal gericht op Vlaamse of Belgische markt omschrijving'),
				},
			]
		);
	};

	const renderTimeUsage = () => {
		const from = formValues.timeUsageFrom ? parseISO(formValues.timeUsageFrom) : undefined;
		const to = formValues.timeUsageTo ? parseISO(formValues.timeUsageTo) : undefined;

		return renderRadiobuttonGroup(
			tText('Gebruik in de tijd label'),
			tText('Gebruik in de tijd subtitel'),
			'timeUsageType',
			[
				{
					label: tText('Onbeperkt'),
					value: MaterialRequestTimeUsage.UNLIMITED,
					description: tHtml('Onbeperkt omschrijving'),
				},
				{
					label: tText('Beperkte periode, namelijk:'),
					value: MaterialRequestTimeUsage.IN_TIME,
					openOnSelect: true,
					description: (
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
					),
				},
			],
			['timeUsageFrom', 'timeUsageTo']
		);
	};

	const renderCopyrightHandling = () => {
		return renderRadiobuttonGroup(
			tText('Bronvermelding label'),
			tText('Bronvermelding subtitel'),
			'copyrightDisplay',
			[
				{
					label: tText('Gelijktijdig met object'),
					value: MaterialRequestCopyrightDisplay.SAME_TIME_WITH_OBJECT,
					description: tHtml('Gelijktijdig met object omschrijving'),
				},
				{
					label: tText('Vermelding bij object, niet noodzakelijk gelijktijdig'),
					value: MaterialRequestCopyrightDisplay.AROUND_OBJECT,
					description: tHtml('Vermelding bij object, niet noodzakelijk gelijktijdig omschrijving'),
				},
				{
					label: tText('Geen vermelding'),
					value: MaterialRequestCopyrightDisplay.NONE,
					description: tHtml('Geen vermelding omschrijving'),
				},
			]
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
				<div className={styles['c-request-material-reuse__content-container']}>
					<div className={styles['c-request-material-reuse__content-form']}>
						{renderVideoSettings()}
						{renderDownloadQuality()}
						{renderIntendedUsage()}
						{renderExploitation()}
						{renderDistributionAccess()}
						{renderDistributionType()}
						{renderMaterialEditing()}
						{renderGeographicalUsage()}
						{renderTimeUsage()}
						{renderCopyrightHandling()}
					</div>
					{renderFooter()}
				</div>
			)}
		</Blade>
	);
};

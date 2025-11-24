import { MaterialRequestsService } from '@material-requests/services';
import {
	type MaterialRequest,
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestExploitation,
	MaterialRequestGeographicalUsage,
	MaterialRequestRequesterCapacity,
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
import { kebabCase } from 'lodash-es';
import { useRouter } from 'next/router';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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

	const [formValues, setFormValues] = useState<MaterialRequest>({ ...materialRequest });
	const [formErrors, setFormErrors] = useState<
		Partial<Record<keyof MaterialRequestReuseSettings, string | undefined>>
	>({});

	/**
	 * Reset form when the model is opened
	 */
	useEffect(() => {
		if (isOpen) {
			setFormValues({ ...materialRequest });
			setFormErrors({});
		}
	}, [isOpen, materialRequest]);

	const onCloseModal = () => {
		onClose();
		refetchMaterialRequests?.();
	};

	const setFormValue = (key: keyof MaterialRequest, value: unknown) => {
		setFormValues((prevState) => ({
			...prevState,
			[key]: value,
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
		async (newFormValues: MaterialRequest | undefined): Promise<boolean> => {
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

	const renderDownloadQuality = () => {
		const radiobuttonOptions = [
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
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Downloadkwaliteit label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Downloadkwaliteit subtitel')}
						radioButtonGroupLabel="download-quality"
						selectedOption={formValues.downloadQuality}
						onChange={(value) => setFormValue('downloadQuality', value)}
						options={radiobuttonOptions}
						error={formErrors.downloadQuality}
					/>
				</dd>
			</dl>
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
		const radiobuttonOptions = [
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
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Commerciële exploitatie label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Commerciële exploitatie subtitel')}
						selectedOption={formValues.exploitation}
						onChange={(value) => setFormValue('exploitation', value)}
						radioButtonGroupLabel="exploitation"
						options={radiobuttonOptions}
						error={formErrors.exploitation}
					/>
				</dd>
			</dl>
		);
	};

	const renderDistributionAccess = () => {
		const radiobuttonOptions = [
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
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Verspreiding materiaal label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Verspreiding materiaal subtitel')}
						selectedOption={formValues.distributionAccess}
						onChange={(value) => setFormValue('distributionAccess', value)}
						radioButtonGroupLabel="distribution-access"
						options={radiobuttonOptions}
						error={formErrors.distributionAccess}
					/>
				</dd>
			</dl>
		);
	};

	const renderDistributionType = () => {
		const radiobuttonOptions = [
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
				description: <span>TODO: More radio buttons</span>,
			},
			{
				label: tText('Andere, namelijk: (te verduidelijken)'),
				value: MaterialRequestDistributionType.OTHER,
				description: (
					<TextArea
						value={formValues.distributionTypeOtherExplanation}
						onChange={(evt) => setFormValue('distributionTypeOtherExplanation', evt.target.value)}
					/>
				),
			},
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Type verspreiding label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Type verspreiding subtitel')}
						selectedOption={formValues.distributionType}
						onChange={(value) => setFormValue('distributionType', value)}
						radioButtonGroupLabel="distribution-type"
						options={radiobuttonOptions}
						error={formErrors.distributionType || formErrors.distributionTypeOtherExplanation}
					/>
				</dd>
			</dl>
		);
	};

	const renderMaterialEditing = () => {
		const radiobuttonOptions = [
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
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Wijziging materiaal label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Wijziging materiaal subtitel')}
						selectedOption={formValues.materialEditing}
						onChange={(value) => setFormValue('materialEditing', value)}
						radioButtonGroupLabel="material-editing"
						options={radiobuttonOptions}
						error={formErrors.materialEditing}
					/>
				</dd>
			</dl>
		);
	};

	const renderGeographicalUsage = () => {
		const radiobuttonOptions = [
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
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Geografisch gebruik label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Geografisch gebruik subtitel')}
						selectedOption={formValues.geographicalUsage}
						onChange={(value) => setFormValue('geographicalUsage', value)}
						radioButtonGroupLabel="geographical-usage"
						options={radiobuttonOptions}
						error={formErrors.geographicalUsage}
					/>
				</dd>
			</dl>
		);
	};

	const renderTimeUsage = () => {
		const radiobuttonOptions = [
			{
				label: tText('Onbeperkt'),
				value: MaterialRequestTimeUsage.UNLIMITED,
				description: tHtml('Onbeperkt omschrijving'),
			},
			{
				label: tText('Beperkte periode, namelijk...'),
				value: MaterialRequestTimeUsage.IN_TIME,
				description: <span>TODO: TIME RANGE</span>,
			},
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Gebruik in de tijd label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Gebruik in de tijd subtitel')}
						selectedOption={formValues.timeUsage}
						onChange={(value) => setFormValue('timeUsage', value)}
						radioButtonGroupLabel="time-usage"
						options={radiobuttonOptions}
						error={formErrors.timeUsage}
					/>
				</dd>
			</dl>
		);
	};

	const renderCopyrightHandling = () => {
		const radiobuttonOptions = [
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
		];

		return (
			<dl className={styles['c-request-material-reuse__content']}>
				<dt className={styles['c-request-material-reuse__content-label']}>
					{/** biome-ignore lint/a11y/noLabelWithoutControl: Inputs can be found in RadioButtonAccordion */}
					<label>{tText('Bronvermelding label')}</label>
				</dt>
				<dd className={styles['c-request-material-reuse__content-value']}>
					<RadioButtonAccordion
						title={tText('Bronvermelding subtitel')}
						selectedOption={formValues.copyrightDisplay}
						onChange={(value) => setFormValue('copyrightDisplay', value)}
						radioButtonGroupLabel="copyright-usage"
						options={radiobuttonOptions}
						error={formErrors.copyrightDisplay}
					/>
				</dd>
			</dl>
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

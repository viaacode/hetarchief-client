import type { User } from '@auth/types';
import { FormControl, RadioButton, TextArea, TextInput } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { ConfirmModalBeforeUnload } from '@shared/components/ConfirmModalBeforeUnload';
import MaxLengthIndicator from '@shared/components/FormControl/MaxLengthIndicator';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useIeObjectSupportTicket } from '@shared/hooks/use-zendesk';
import { toastService } from '@shared/services/toast-service';
import type { Locale } from '@shared/utils/i18n';
import {
	GET_LEGAL_REASON_OPTIONS,
	GET_REPORT_OPTIONS,
	LEGAL_REMARK_SCHEMA,
	REPORT_FORM_SCHEMA,
	REPORT_LEGAL_REMARK_MAX_LENGTH,
} from '@visitor-space/components/ReportBlade/ReportBlade.const';
import { sanitizeReportText } from '@visitor-space/components/ReportBlade/ReportBlade.helpers';
import clsx from 'clsx';
import { type FC, useCallback, useEffect, useState } from 'react';

import styles from '../ReportBlade.module.scss';
import { type ReportLegalReason, ReportReason } from '../ReportBlade.types';

interface ReportIssuesBladeProps {
	id: string;
	className?: string;
	ariaLabel: string;
	isOpen: boolean;
	layer: number;
	currentLayer: number;
	user?: User | null;
	isKeyUser: boolean;
	isOwnOrganisation: boolean;
	locale: Locale;
	onClose: () => void;
	onAdvanceToMetadataIssue: () => void;
}

const ReportIssuesBlade: FC<ReportIssuesBladeProps> = ({
	id,
	className,
	ariaLabel,
	isOpen,
	layer,
	currentLayer,
	user,
	isKeyUser,
	isOwnOrganisation,
	locale,
	onClose,
	onAdvanceToMetadataIssue,
}) => {
	const { mutateAsync: createIeObjectSupportTicket } = useIeObjectSupportTicket();

	const [selectedReportReason, setSelectedReportReason] = useState<ReportReason | null>(null);
	const [legalReason, setLegalReason] = useState<ReportLegalReason | null>(null);
	const [legalRemarkText, setLegalRemarkText] = useState<string>('');
	const [reportMessage, setReportMessage] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isSubmittingForm, setIsSubmittingForm] = useState(false);
	const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

	/**
	 * Methods
	 */

	const resetForm = useCallback(() => {
		setSelectedReportReason(null);
		setLegalReason(null);
		setLegalRemarkText('');
		setReportMessage('');
		setEmail(user?.email || '');
		setFormErrors({});
	}, [user?.email]);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (user?.email) {
			setEmail(user.email);
		}
	}, [user?.email]);

	useEffect(() => {
		if (isOpen) {
			resetForm();
		}
	}, [isOpen, resetForm]);

	/**
	 * Events
	 */

	const onFailedRequest = () => {
		toastService.notify({
			title: tHtml('modules/visitor-space/components/report-blade/report-blade___er-ging-iets-mis'),
			description: tHtml(
				'modules/visitor-space/components/report-blade/report-blade___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-later-opnieuw'
			),
		});
	};

	const onSuccessfulRequest = () => {
		toastService.notify({
			title: tHtml('modules/visitor-space/components/report-blade/report-blade___gerapporteerd'),
			description: tHtml(
				'modules/visitor-space/components/report-blade/report-blade___uw-bericht-werd-succesvol-verstuurd'
			),
		});
		onClose();
	};

	const submitGeneralQuestion = async () => {
		const errors = await validateForm(
			{ reportMessage, email: user?.email || email },
			REPORT_FORM_SCHEMA()
		);
		if (errors) {
			setFormErrors(errors);
			return;
		}

		await createIeObjectSupportTicket({
			reportReason: ReportReason.GENERAL_QUESTION,
			locale,
			url: window.location.href,
			email: user?.email || email,
			name: user?.fullName || tText('Niet-ingelogde gebruiker'),
			message: sanitizeReportText(reportMessage),
		});
		onSuccessfulRequest();
	};

	const submitLegalRemark = async () => {
		const errors = await validateForm(
			{ legalReason: legalReason || '', legalRemarkText, email: user?.email || email },
			LEGAL_REMARK_SCHEMA()
		);
		if (errors) {
			setFormErrors(errors);
			return;
		}

		await createIeObjectSupportTicket({
			reportReason: ReportReason.LEGAL_REMARK,
			reportLegalReason: legalReason as ReportLegalReason,
			locale,
			url: window.location.href,
			email: user?.email || email,
			name: user?.fullName || tText('Niet-ingelogde gebruiker'),
			message: sanitizeReportText(legalRemarkText),
		});
		onSuccessfulRequest();
	};

	const handleSubmit = async () => {
		if (!selectedReportReason) {
			setFormErrors({ selectedReportReason: tText('Kies een van de bovenstaande opties') });
			return;
		}

		try {
			setIsSubmittingForm(true);
			setFormErrors({});

			if (selectedReportReason === ReportReason.METADATA_ISSUE) {
				onAdvanceToMetadataIssue();
				return;
			}
			if (selectedReportReason === ReportReason.GENERAL_QUESTION) {
				await submitGeneralQuestion();
				return;
			}
			await submitLegalRemark();
		} catch (_err) {
			onFailedRequest();
		} finally {
			setIsSubmittingForm(false);
		}
	};

	/**
	 * Render
	 */

	const getTitle = (): string =>
		tText('modules/visitor-space/components/report-blade/report-blade___rapporteren');

	const getPrimaryButtonLabel = (): string => {
		if (selectedReportReason === ReportReason.LEGAL_REMARK) {
			return tText('Verstuur opmerking');
		}
		if (selectedReportReason === ReportReason.METADATA_ISSUE) {
			return tText('Ga door');
		}
		// Default (nothing selected yet) and ReportReason.GENERAL_QUESTION
		return tText('modules/visitor-space/components/report-blade/report-blade___rapporteer');
	};

	const getFooterButtons = (): BladeFooterButtonProps => [
		{
			label: getPrimaryButtonLabel(),
			mobileLabel: getPrimaryButtonLabel(),
			type: 'primary',
			onClick: handleSubmit,
			disabled: isSubmittingForm,
		},
		{
			label: tText('modules/visitor-space/components/report-blade/report-blade___annuleer'),
			mobileLabel: tText(
				'modules/visitor-space/components/report-blade/report-blade___annuleer-mobiel'
			),
			type: 'secondary',
			onClick: onClose,
		},
	];

	const renderEmailField = () => (
		<FormControl
			className={clsx({
				[styles['c-report-blade__input--disabled']]: !!user?.email,
			})}
			errors={[<RedFormWarning error={formErrors.email} key="form-error--email" />]}
			id="email"
			label={tHtml('modules/visitor-space/components/report-blade/report-blade___email-adres')}
		>
			<TextInput
				type="email"
				id="email"
				name="email"
				autoComplete="email"
				disabled={!!user?.email}
				value={user?.email || email}
				onChange={(evt) => {
					if (user?.email) {
						return;
					}
					setEmail(evt.currentTarget.value);
				}}
				ariaLabel={tText(
					'modules/visitor-space/components/report-blade/report-blade___jouw-email-adres-input-aria-label'
				)}
			/>
		</FormControl>
	);

	const renderReportMessageField = () => (
		<FormControl
			className="u-mb-24"
			errors={[<RedFormWarning error={formErrors.reportMessage} key="form-error--report" />]}
			id="reportMessage"
		>
			<TextArea
				id="reportMessage"
				name="reportMessage"
				value={reportMessage}
				onChange={(evt) => setReportMessage(evt.target.value)}
				ariaLabel={tText(
					'modules/visitor-space/components/report-blade/report-blade___beschrijf-het-probleem-input-aria-label'
				)}
			/>
		</FormControl>
	);

	const renderLegalReasonOptions = () => (
		<>
			{GET_LEGAL_REASON_OPTIONS().map((option) => (
				<RadioButton
					key={option.value}
					className={styles['c-report-blade__radio-button']}
					label={option.label}
					aria-label={option.label}
					checked={legalReason === option.value}
					onClick={() => setLegalReason(option.value)}
				/>
			))}
			<RedFormWarning error={formErrors.legalReason} />
		</>
	);

	const renderLegalRemarkTextArea = () => (
		<FormControl
			className="u-mb-24 u-mt-24"
			errors={[
				<div className="u-flex" key="form-error--legal-remark">
					<RedFormWarning error={formErrors.legalRemarkText} />
					<MaxLengthIndicator maxLength={REPORT_LEGAL_REMARK_MAX_LENGTH} value={legalRemarkText} />
				</div>,
			]}
			id="legalRemarkText"
			label={tHtml('Opmerking')}
		>
			<TextArea
				id="legalRemarkText"
				name="legalRemarkText"
				value={legalRemarkText}
				maxLength={REPORT_LEGAL_REMARK_MAX_LENGTH}
				onChange={(evt) => setLegalRemarkText(evt.target.value)}
				ariaLabel={tText('Opmerking')}
			/>
		</FormControl>
	);

	const renderExtraFieldsSection = () => {
		if (
			selectedReportReason !== ReportReason.GENERAL_QUESTION &&
			selectedReportReason !== ReportReason.LEGAL_REMARK
		) {
			return null;
		}

		return (
			<>
				<hr className={styles['c-report-blade__divider']} />
				<h3 className={styles['c-report-blade__subtitle']}>
					{tHtml(
						'modules/visitor-space/components/report-blade/report-blade___beschrijf-het-probleem'
					)}
				</h3>
				{selectedReportReason === ReportReason.GENERAL_QUESTION && (
					<>
						{renderReportMessageField()}
						{renderEmailField()}
					</>
				)}
				{selectedReportReason === ReportReason.LEGAL_REMARK && (
					<>
						{renderLegalReasonOptions()}
						{renderLegalRemarkTextArea()}
						{renderEmailField()}
					</>
				)}
			</>
		);
	};

	const hasUnsavedLegalRemarkChanges =
		selectedReportReason === ReportReason.LEGAL_REMARK && (!!legalReason || !!legalRemarkText);

	return (
		<Blade
			id={id}
			className={clsx(className, styles['c-report-blade'])}
			isOpen={isOpen}
			layer={layer}
			currentLayer={currentLayer}
			onClose={onClose}
			title={getTitle()}
			footerButtons={getFooterButtons()}
			isBladeInvalid={
				!!formErrors.selectedReportReason ||
				!!formErrors.reportMessage ||
				!!formErrors.email ||
				!!formErrors.legalReason ||
				!!formErrors.legalRemarkText
			}
			ariaLabel={ariaLabel}
		>
			<h3 className={styles['c-report-blade__subtitle']}>{tHtml('Wat wil je rapporteren?')}</h3>
			{GET_REPORT_OPTIONS(isKeyUser, isOwnOrganisation).map((option) => (
				<RadioButton
					key={option.value}
					className={styles['c-report-blade__radio-button']}
					label={option.label}
					aria-label={option.label}
					checked={selectedReportReason === option.value}
					onClick={() => setSelectedReportReason(option.value)}
				/>
			))}
			<RedFormWarning error={formErrors.selectedReportReason} />
			{renderExtraFieldsSection()}
			<ConfirmModalBeforeUnload
				when={hasUnsavedLegalRemarkChanges}
				message={tText(
					'Ben je zeker dat je dit venster wilt sluiten? Hiermee gaat je opmerking verloren.'
				)}
			/>
		</Blade>
	);
};

export default ReportIssuesBlade;

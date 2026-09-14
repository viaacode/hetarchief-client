import type { User } from '@auth/types';
import { FormControl, TextArea, TextInput } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { CopyButton } from '@shared/components/CopyButton';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useIeObjectSupportTicket } from '@shared/hooks/use-zendesk';
import { toastService } from '@shared/services/toast-service';
import type { Locale } from '@shared/utils/i18n';
import type { HetArchiefIeObject } from '@viaa/avo2-types';
import { REPORT_FORM_SCHEMA } from '@visitor-space/components/ReportBlade/ReportBlade.const';
import {
	buildAiMeemooUrl,
	buildMamUrl,
	sanitizeReportText,
} from '@visitor-space/components/ReportBlade/ReportBlade.helpers';
import clsx from 'clsx';
import { type FC, type ReactNode, useCallback, useEffect, useState } from 'react';

import styles from '../ReportBlade.module.scss';
import { ReportReason } from '../ReportBlade.types';

interface ReportMetadataIssueBladeProps {
	id: string;
	className?: string;
	ariaLabel: string;
	isOpen: boolean;
	layer: number;
	currentLayer: number;
	user?: User | null;
	mediaInfo?: HetArchiefIeObject | null;
	isOwnOrganisation: boolean;
	locale: Locale;
	onClose: () => void;
}

const ReportMetadataIssueBlade: FC<ReportMetadataIssueBladeProps> = ({
	id,
	className,
	ariaLabel,
	isOpen,
	layer,
	currentLayer,
	user,
	mediaInfo,
	isOwnOrganisation,
	locale,
	onClose,
}) => {
	const { mutateAsync: createIeObjectSupportTicket } = useIeObjectSupportTicket();

	const [reportMessage, setReportMessage] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isSubmittingForm, setIsSubmittingForm] = useState(false);
	const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

	/**
	 * Methods
	 */

	const resetForm = useCallback(() => {
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

	const onMissingSubmissionData = () => {
		toastService.notify({
			title: tHtml('Er ging iets mis'),
			description: tHtml(
				'Dit object kan momenteel niet gerapporteerd worden. Probeer het later opnieuw of neem contact op met meemoo.'
			),
		});
	};

	const handleSubmit = async () => {
		try {
			setIsSubmittingForm(true);
			setFormErrors({});
			const errors = await validateForm(
				{ reportMessage, email: user?.email || email },
				REPORT_FORM_SCHEMA()
			);
			if (errors) {
				setFormErrors(errors);
				return;
			}

			const maintainerId = mediaInfo?.maintainerId;
			const mamUrl = buildMamUrl(mediaInfo?.fragmentId);
			const aiMeemooUrl = buildAiMeemooUrl(mediaInfo?.fragmentId);
			if (!maintainerId || !mamUrl || !aiMeemooUrl) {
				// Must never silently happen: the provider email needs both links and a
				// resolvable maintainer, so block submission entirely instead.
				onMissingSubmissionData();
				return;
			}

			await createIeObjectSupportTicket({
				reportReason: ReportReason.METADATA_ISSUE,
				locale,
				url: window.location.href,
				email: user?.email || email,
				name: user?.fullName || tText('Niet-ingelogde gebruiker'),
				message: sanitizeReportText(reportMessage),
				maintainerId,
				mamUrl,
				aiMeemooUrl,
			});
			onSuccessfulRequest();
		} catch (_err) {
			onFailedRequest();
		} finally {
			setIsSubmittingForm(false);
		}
	};

	/**
	 * Render
	 */

	const renderLinkRow = (url: string | null, label: string): ReactNode => (
		<div className="u-mb-16">
			<div className="u-flex u-flex-align-center">
				<span className="u-flex-grow u-text-ellipsis">{url || label}</span>
				<CopyButton text={url || ''} disabled={!url} variants="text" />
			</div>
			{!url && (
				<RedFormWarning
					error={tText('Deze link is momenteel niet beschikbaar. Neem contact op met meemoo.')}
				/>
			)}
		</div>
	);

	const renderOwnOrganisationContent = (): ReactNode => {
		const mamUrl = buildMamUrl(mediaInfo?.fragmentId);
		const aiMeemooUrl = buildAiMeemooUrl(mediaInfo?.fragmentId);
		return (
			<>
				<p className="u-mb-24">
					{tHtml(
						'Gebruik deze links om de metadata aan te (laten) passen in het meemoo-archiefsysteem of op ai.meemoo.be.'
					)}
				</p>
				{renderLinkRow(mamUrl, tText('Link naar het object in het MAM'))}
				{renderLinkRow(aiMeemooUrl, tText('Link naar het object op ai.meemoo.be'))}
			</>
		);
	};

	const renderOtherOrganisationContent = (): ReactNode => (
		<>
			<FormControl
				className="u-mb-24"
				errors={[<RedFormWarning error={formErrors.reportMessage} key="form-error--report" />]}
				id="reportMessage"
				label={tHtml(
					'modules/visitor-space/components/report-blade/report-blade___beschrijf-het-probleem'
				)}
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
			<FormControl
				className={clsx('u-mb-24', {
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
		</>
	);

	const getFooterButtons = (): BladeFooterButtonProps => {
		if (isOwnOrganisation) {
			return [
				{
					label: tText('Sluiten'),
					mobileLabel: tText('Sluiten'),
					type: 'primary',
					onClick: onClose,
				},
			];
		}

		return [
			{
				label: tText('modules/visitor-space/components/report-blade/report-blade___rapporteer'),
				mobileLabel: tText(
					'modules/visitor-space/components/report-blade/report-blade___rapporteer-mobiel'
				),
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
	};

	return (
		<Blade
			id={id}
			className={clsx(className, styles['c-report-blade'])}
			isOpen={isOpen}
			layer={layer}
			currentLayer={currentLayer}
			onClose={onClose}
			title={tText('modules/visitor-space/components/report-blade/report-blade___rapporteren')}
			footerButtons={getFooterButtons()}
			isBladeInvalid={!isOwnOrganisation && (!!formErrors.reportMessage || !!formErrors.email)}
			ariaLabel={ariaLabel}
		>
			{isOwnOrganisation ? renderOwnOrganisationContent() : renderOtherOrganisationContent()}
		</Blade>
	);
};

export default ReportMetadataIssueBlade;

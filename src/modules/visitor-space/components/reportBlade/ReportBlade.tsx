import { Button, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import type { Requests } from 'node-zendesk';
import { type FC, useCallback, useEffect, useState } from 'react';

import { Blade } from '@shared/components/Blade/Blade';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useZendesk } from '@shared/hooks/use-zendesk';
import { toastService } from '@shared/services/toast-service';
import { REPORT_FORM_SCHEMA } from '@visitor-space/components/reportBlade/ReportBlade.const';

import styles from './ReportBlade.module.scss';
import type { ReportBladeProps } from './ReportBlade.types';

const ReportBlade: FC<ReportBladeProps> = (props) => {
	const { user } = props;
	const { mutateAsync: createZendeskTicket } = useZendesk();
	const [reportMessage, setReportMessage] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isSubmittingForm, setIsSubmittingForm] = useState(false);
	const [formErrors, setFormErrors] = useState<{
		reportMessage?: string;
		email?: string;
	}>({});

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
		if (props.isOpen) {
			resetForm();
		}
	}, [props.isOpen, resetForm]);

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
		onCloseBlade();
	};

	const handleFormSubmit = async () => {
		try {
			setIsSubmittingForm(true);
			const errors = await validateForm(
				{
					reportMessage,
					email: email,
				},
				REPORT_FORM_SCHEMA()
			);
			if (errors) {
				setFormErrors(errors);
				setIsSubmittingForm(false);
				return;
			}
			const ticket: Requests.CreateModel = {
				comment: {
					url: window.location.href,
					body: reportMessage,
					html_body: `<dl><dt>${tText(
						'modules/visitor-space/components/report-blade/report-blade___reden-van-rapporteren'
					)}</dt><dd>${reportMessage}</dd><dt>${tText(
						'modules/visitor-space/components/report-blade/report-blade___pagina-url'
					)}</dt><dd>${window.location.href}</dd></dl>`,
					public: false,
				},

				subject: `${tText('modules/visitor-space/components/report-blade/report-blade___media-item-gerapporteerd-door-gebruiker-op-het-archief')}`,
				requester: {
					email: user?.email || email,
					name:
						user?.fullName ||
						`${tText('modules/visitor-space/components/report-blade/report-blade___niet-ingelogde-gebruiker')}`,
				},
			};
			await createZendeskTicket(ticket);
			onSuccessfulRequest();
		} catch (err) {
			onFailedRequest();
		} finally {
			setIsSubmittingForm(false);
		}
	};

	const onCloseBlade = () => {
		props.onClose?.();
		// Wait for the blade to close before resetting the form
		setTimeout(resetForm, 500);
	};

	/**
	 * Render
	 */

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={tHtml('modules/visitor-space/components/report-blade/report-blade___rapporteer')}
					variants={['block', 'black']}
					onClick={handleFormSubmit}
					disabled={isSubmittingForm}
				/>

				<Button
					label={tHtml('modules/visitor-space/components/report-blade/report-blade___annuleer')}
					variants={['block', 'text']}
					onClick={onCloseBlade}
				/>
			</div>
		);
	};

	return (
		<Blade
			{...props}
			className={clsx(props.className, styles['c-report-blade'])}
			footer={props.isOpen && renderFooter()}
			onClose={onCloseBlade}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2 {...props}>
					{tHtml('modules/visitor-space/components/report-blade/report-blade___rapporteren')}
				</h2>
			)}
		>
			<div className="u-px-32 u-px-16-md">
				{props.isOpen && (
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
							disabled={!props.isOpen}
							value={reportMessage}
							onChange={(evt) => {
								const report = evt.target.value;
								setReportMessage(report);
							}}
						/>
					</FormControl>
				)}

				{props.isOpen && (
					<FormControl
						className={clsx('u-mb-24', {
							[styles['c-report-blade__input--disabled']]: !!user?.email,
						})}
						errors={[<RedFormWarning error={formErrors.email} key="form-error--email" />]}
						id="email"
						label={tHtml(
							'modules/visitor-space/components/report-blade/report-blade___email-adres'
						)}
					>
						<TextInput
							type="email"
							id="email"
							name="email"
							autoComplete="email"
							disabled={!props.isOpen || !!user?.email}
							value={user?.email || email}
							onChange={(evt) => {
								if (user?.email) {
									return;
								}

								const email = evt.currentTarget.value;
								setEmail(email);
							}}
						/>
					</FormControl>
				)}
			</div>
		</Blade>
	);
};

export default ReportBlade;

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { Requests } from 'node-zendesk';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Blade } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useZendesk } from '@shared/hooks/use-zendesk';
import { toastService } from '@shared/services/toast-service';

import { REPORT_FORM_SCHEMA } from './ReportBlade.const';
import styles from './ReportBlade.module.scss';
import { ReportBladeProps, ReportFormState } from './ReportBlade.types';

const ReportBlade: FC<ReportBladeProps> = (props) => {
	const { tHtml } = useTranslation();
	const { user } = props;
	const { mutateAsync: createZendeskTicket } = useZendesk();
	const [report, setReport] = useState<string>();
	const [email, setEmail] = useState<string>();
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ReportFormState>({
		resolver: yupResolver(REPORT_FORM_SCHEMA()),
		defaultValues: useMemo(() => ({ report, email }), [report, email]),
	});

	/**
	 * Methods
	 */

	/**
	 * Effects
	 */

	useEffect(() => {
		setValue('report', report || '');
	}, [setValue, report]);

	useEffect(() => {
		setValue('email', email || '');
	}, [setValue, email]);

	useEffect(() => {
		if (user?.email) {
			setValue('email', user.email);
		}
	}, [setValue, user?.email]);

	useEffect(() => {
		props.isOpen && reset();
	}, [props.isOpen, reset]);

	/**
	 * Events
	 */

	const onFailedRequest = () => {
		toastService.notify({
			title: tHtml('Er ging iets mis'),
			description: tHtml(
				'Er is een fout opgetreden tijdens het opslaan. Probeer later opnieuw.'
			),
		});
	};

	const onFormSubmit = async () => {
		const ticket: Requests.CreateModel = {
			comment: {
				url: window.location.href,
				body: report,
				html_body: `<dl><dt>${tHtml(
					'Reden van rapporteren'
				)}</dt><dd>${report}</dd><dt>${tHtml('pagina url')}</dt><dd>${
					window.location.href
				}</dd></dl>`,
				public: false,
			},

			subject: `${tHtml('Media item gerapporteerd door gebruiker op Het Archief')}`,
			requester: {
				email: user?.email || email,
				name: user?.fullName || '',
			},
		};

		try {
			await createZendeskTicket(ticket);
		} catch (err) {
			onFailedRequest();
		}
	};

	const onCloseBlade = () => {
		setReport(undefined);
		setEmail(undefined);
		props.onClose?.();
	};

	/**
	 * Render
	 */

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit, () => console.error(errors))}
					disabled={isSubmitting}
				/>

				<Button
					label={tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___annuleer'
					)}
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
			renderTitle={(props) => (
				<h3 {...props}>
					{tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___rapporteren'
					)}
				</h3>
			)}
		>
			<div className="u-px-16 u-px-32:md">
				{props.isOpen && (
					<FormControl
						className="u-mb-24"
						errors={[errors.report?.message]}
						id="report"
						label={tHtml(
							'modules/visitor-space/components/report-blade/report-blade___beschrijf-het-probleem'
						)}
					>
						<Controller
							name="report"
							control={control}
							render={(field) => (
								<TextArea
									{...field}
									id="field"
									disabled={!props.isOpen}
									value={report}
									onChange={(e) => {
										const report = e.currentTarget.value;
										setReport(report);
									}}
								/>
							)}
						/>
					</FormControl>
				)}

				{props.isOpen && (
					<FormControl
						className={clsx('u-mb-24', {
							[styles['c-report-blade__input--disabled']]: !!user?.email,
						})}
						errors={[errors.email?.message]}
						id="email"
						label={tHtml(
							'modules/visitor-space/components/report-blade/report-blade___email'
						)}
					>
						<Controller
							name="email"
							control={control}
							render={(field) => (
								<TextInput
									{...field}
									type="email"
									id="field"
									disabled={!props.isOpen || !!user?.email}
									value={user?.email || email}
									onChange={(e) => {
										if (user?.email) {
											return;
										}

										const email = e.currentTarget.value;
										setEmail(email);
									}}
								/>
							)}
						/>
					</FormControl>
				)}
			</div>
		</Blade>
	);
};

export default ReportBlade;

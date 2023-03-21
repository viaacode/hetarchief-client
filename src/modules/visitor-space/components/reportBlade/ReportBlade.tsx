import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Folder } from '@account/types';
import { Blade } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';

import { REPORT_FORM_SCHEMA } from './ReportBlade.const';
import styles from './ReportBlade.module.scss';
import { ReportBladeProps, ReportFormState, ReportSelected } from './ReportBlade.types';

const ReportBlade: FC<ReportBladeProps> = (props) => {
	const { tHtml } = useTranslation();
	const { onSubmit, selected } = props;
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
		props.isOpen && reset();
	}, [props.isOpen, reset]);

	/**
	 * Events
	 */

	const onFailedRequest = () => {
		// getFolders.refetch();

		toastService.notify({
			title: tHtml(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-ging-iets-mis'
			),
			description: tHtml(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const onFormSubmit = (values: ReportFormState) => {
		console.log(values);
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
					onClick={props.onClose}
				/>
			</div>
		);
	};

	const title = selected?.title;

	return (
		<Blade
			{...props}
			className={clsx(props.className, styles['c-report-blade'])}
			footer={props.isOpen && renderFooter()}
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
								<TextArea {...field} id="field" disabled={!props.isOpen} />
							)}
						/>
					</FormControl>
				)}

				{props.isOpen && (
					<FormControl
						className="u-mb-24"
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
									disabled={!props.isOpen}
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

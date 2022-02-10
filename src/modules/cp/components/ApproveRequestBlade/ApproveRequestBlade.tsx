import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	FormControl,
	futureDatepicker,
	TextInput,
	timepicker,
} from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';

import { Blade, Icon } from '@shared/components';
import { Datepicker } from '@shared/components/Datepicker';
import { Timepicker } from '@shared/components/Timepicker';
import { OPTIONAL_LABEL } from '@shared/const';
import { getNearestFutureQuarter } from '@shared/utils';

import {
	APPROVE_REQUEST_FORM_SCHEMA,
	ApproveRequestAccessDateFormatter,
	ApproveRequestAccessTimeFormatter,
} from './ApproveRequestBlade.const';
import { ApproveRequestBladeProps, ApproveRequestFormState } from './ApproveRequestBlade.types';

const anHour = 1000 * 60 * 60;

const ApproveRequestBlade: FC<ApproveRequestBladeProps> = (props) => {
	const { onSubmit } = props;

	const { t } = useTranslation();
	const { control, formState, handleSubmit } = useForm<ApproveRequestFormState>({
		resolver: yupResolver(APPROVE_REQUEST_FORM_SCHEMA()),
		defaultValues: {
			accessFrom: getNearestFutureQuarter(new Date()),
			accessTo: new Date(getNearestFutureQuarter(new Date()).valueOf() + anHour),
		},
	});
	const { errors } = formState;

	// Events

	const onFormSubmit = (values: ApproveRequestFormState) => {
		onSubmit?.(values);
	};

	const onSimpleDateChange = (
		date: Date | null,
		field:
			| ControllerRenderProps<ApproveRequestFormState, 'accessTo'>
			| ControllerRenderProps<ApproveRequestFormState, 'accessFrom'>
	) => {
		field.onChange(date);
	};

	// Render

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-16">
				<Button
					label={t('Keur goed')}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
				/>

				<Button
					label={t('Annuleer')}
					variants={['block', 'text']}
					onClick={props.onClose}
				/>
			</div>
		);
	};

	return (
		<Blade {...props} footer={renderFooter()} title={t('Aanvraag goedkeuren')}>
			<div className="u-px-32">
				<FormControl
					className="u-mb-24"
					errors={[errors.accessFrom?.message]}
					label={t('Van')}
				>
					<Controller
						name="accessFrom"
						control={control}
						render={({ field }) => (
							<>
								<Datepicker
									{...futureDatepicker}
									{...field}
									onChange={(date) => onSimpleDateChange(date, field)}
									value={ApproveRequestAccessDateFormatter(field.value)}
									selected={field.value}
									customInput={<TextInput iconStart={<Icon name="calendar" />} />}
								/>

								<Timepicker
									{...timepicker}
									{...field}
									onChange={(date) => onSimpleDateChange(date, field)}
									value={ApproveRequestAccessTimeFormatter(field.value)}
									selected={field.value}
									customInput={<TextInput iconStart={<Icon name="clock" />} />}
								/>
							</>
						)}
					/>
				</FormControl>

				<FormControl
					className="u-mb-24"
					errors={[errors.accessTo?.message]}
					label={t('Tot')}
				>
					<Controller
						name="accessTo"
						control={control}
						render={({ field }) => {
							return (
								<>
									<Datepicker
										{...futureDatepicker}
										{...field}
										onChange={(date) => onSimpleDateChange(date, field)}
										value={ApproveRequestAccessDateFormatter(field.value)}
										selected={field.value}
										customInput={
											<TextInput iconStart={<Icon name="calendar" />} />
										}
									/>

									<Timepicker
										{...timepicker}
										{...field}
										onChange={(date) => onSimpleDateChange(date, field)}
										value={ApproveRequestAccessTimeFormatter(field.value)}
										selected={field.value}
										customInput={
											<TextInput iconStart={<Icon name="clock" />} />
										}
									/>
								</>
							);
						}}
					/>
				</FormControl>

				<FormControl label={t('Opmerkingen')} suffix={OPTIONAL_LABEL()}>
					<Controller
						name="accessRemark"
						control={control}
						render={({ field }) => <TextInput {...field} />}
					/>
				</FormControl>
			</div>
		</Blade>
	);
};

export default ApproveRequestBlade;

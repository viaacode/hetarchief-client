import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	FormControl,
	futureDatepicker,
	TextInput,
	timepicker,
} from '@meemoo/react-components';
import clsx from 'clsx';
import {
	addHours,
	differenceInHours,
	endOfDay,
	isAfter,
	isToday,
	roundToNearestMinutes,
	startOfDay,
} from 'date-fns';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';

import { Blade, Icon } from '@shared/components';
import { Datepicker } from '@shared/components/Datepicker';
import { Timepicker } from '@shared/components/Timepicker';
import { OPTIONAL_LABEL } from '@shared/const';

import parentStyles from '../ProcessRequestBlade/ProcessRequestBlade.module.scss';

import {
	APPROVE_REQUEST_FORM_SCHEMA,
	ApproveRequestAccessDateFormatter,
	ApproveRequestAccessTimeFormatter,
} from './ApproveRequestBlade.const';
import styles from './ApproveRequestBlade.module.scss';
import { ApproveRequestBladeProps, ApproveRequestFormState } from './ApproveRequestBlade.types';

const rtnm15 = (date: Date) => roundToNearestMinutes(date, { nearestTo: 15 });
const defaultAccessFrom = (start: Date) => rtnm15(start);
const defaultAccessTo = (accessFrom: Date) => addHours(rtnm15(accessFrom), 1);

const ApproveRequestBlade: FC<ApproveRequestBladeProps> = (props) => {
	const { onSubmit } = props;

	const { t } = useTranslation();
	const {
		control,
		formState: { errors },
		handleSubmit,
		getValues,
		setValue,
	} = useForm<ApproveRequestFormState>({
		resolver: yupResolver(APPROVE_REQUEST_FORM_SCHEMA()),
		defaultValues: {
			accessFrom: defaultAccessFrom(new Date()),
			accessTo: defaultAccessTo(new Date()),
		},
	});

	// Events

	const onFormSubmit = (values: ApproveRequestFormState) => {
		// TODO: replace with save-to-db
		Promise.resolve().then(() => {
			onSubmit?.(values);
		});
	};

	const onSimpleDateChange = (
		date: Date | null,
		field:
			| ControllerRenderProps<ApproveRequestFormState, 'accessTo'>
			| ControllerRenderProps<ApproveRequestFormState, 'accessFrom'>
	) => {
		field.onChange(date);
	};

	const onFromDateChange = (
		date: Date | null,
		field: ControllerRenderProps<ApproveRequestFormState, 'accessFrom'>
	) => {
		onSimpleDateChange(date, field);

		if (date) {
			const { accessTo } = getValues();

			// Access must be at least 1h in the future
			// Aligns with `minTime` of the `accessTo` `Timepicker`-component
			if (accessTo && isAfter(date, accessTo) && differenceInHours(date, accessTo) <= 1) {
				setValue('accessTo', defaultAccessTo(date));
			}
		}
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
			<div className={parentStyles['c-process-request-blade__details']}>
				<strong>
					{t(
						'modules/cp/components/process-request-blade/process-request-blade___wanneer-wil-je-de-leeszaal-bezoeken'
					)}
				</strong>
				<p>{props.selected?.time}</p>
			</div>

			<div className="u-px-32">
				<FormControl
					className={clsx(styles['c-approve-request-blade__date-time'], 'u-mb-32')}
					errors={[errors.accessFrom?.message]}
					label={t('Van')}
				>
					<Controller
						name="accessFrom"
						control={control}
						render={({ field }) => {
							const now = new Date();

							return (
								<>
									<Datepicker
										{...futureDatepicker}
										maxDate={null}
										{...field}
										onChange={(date) => onFromDateChange(date, field)}
										value={ApproveRequestAccessDateFormatter(field.value)}
										selected={field.value}
										customInput={
											<TextInput iconStart={<Icon name="calendar" />} />
										}
									/>

									<Timepicker
										{...timepicker}
										maxTime={endOfDay(now)}
										minTime={defaultAccessFrom(now)}
										{...field}
										onChange={(date) => onFromDateChange(date, field)}
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

				<FormControl
					className={clsx(styles['c-approve-request-blade__date-time'], 'u-mb-32')}
					errors={[errors.accessTo?.message]}
					label={t('Tot')}
				>
					<Controller
						name="accessTo"
						control={control}
						render={({ field }) => {
							const { accessFrom } = getValues();
							const now = new Date();

							return (
								<>
									<Datepicker
										{...futureDatepicker}
										maxDate={null}
										minDate={accessFrom}
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
										maxTime={endOfDay(accessFrom || now)}
										minTime={
											isToday(field.value || now)
												? addHours(accessFrom || now, 1)
												: startOfDay(field.value || now)
										}
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

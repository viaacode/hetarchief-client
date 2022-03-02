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
	isSameDay,
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
import { toastService } from '@shared/services/toast-service';
import { visitsService } from '@visits/services';
import { VisitStatus } from '@visits/types';

import parentStyles from '../ProcessRequestBlade/ProcessRequestBlade.module.scss';

import { APPROVE_REQUEST_FORM_SCHEMA } from './ApproveRequestBlade.const';
import styles from './ApproveRequestBlade.module.scss';
import { ApproveRequestBladeProps, ApproveRequestFormState } from './ApproveRequestBlade.types';
import {
	formatApproveRequestAccessDate,
	formatApproveRequestAccessTime,
} from './ApproveRequestBlade.utils';

const roundToNearestQuarter = (date: Date) => roundToNearestMinutes(date, { nearestTo: 15 });
const defaultAccessFrom = (start: Date) => roundToNearestQuarter(start);
const defaultAccessTo = (accessFrom: Date) => addHours(roundToNearestQuarter(accessFrom), 1);

const ApproveRequestBlade: FC<ApproveRequestBladeProps> = (props) => {
	const { selected, onClose, onSubmit } = props;

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
		selected &&
			visitsService
				.putById(selected.id, {
					...selected,
					status: VisitStatus.APPROVED,
					startAt: values.accessFrom?.toISOString(),
					endAt: values.accessTo?.toISOString(),
					// TODO: remarks
				})
				.then(() => {
					onSubmit?.(values);

					toastService.notify({
						title: t(
							'modules/cp/components/approve-request-blade/approve-request-blade___de-aanvraag-is-goedgekeurd'
						),
						description: t(
							'modules/cp/components/approve-request-blade/approve-request-blade___deze-aanvraag-werd-succesvol-goedgekeurd'
						),
					});
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

		const { accessTo } = getValues();

		if (date && accessTo) {
			// Access must be at least 1h in the future
			// Aligns with `minTime` of the `accessTo` `Timepicker`-component
			if (
				(isSameDay(date, accessTo) && differenceInHours(date, accessTo) <= 1) ||
				isAfter(date, accessTo)
			) {
				setValue('accessTo', defaultAccessTo(date));
			}
		}
	};

	// Render

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-16">
				<Button
					label={t(
						'modules/cp/components/approve-request-blade/approve-request-blade___keur-goed'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
				/>

				<Button
					label={t(
						'modules/cp/components/approve-request-blade/approve-request-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={onClose}
				/>
			</div>
		);
	};

	return (
		<Blade
			{...props}
			footer={renderFooter()}
			title={t(
				'modules/cp/components/approve-request-blade/approve-request-blade___aanvraag-goedkeuren'
			)}
		>
			<div className={parentStyles['c-process-request-blade__details']}>
				<strong>
					{t(
						'modules/cp/components/process-request-blade/process-request-blade___wanneer-wil-je-de-leeszaal-bezoeken'
					)}
				</strong>
				<p>{selected?.timeframe}</p>
			</div>

			<div className="u-px-32">
				<FormControl
					className={clsx(styles['c-approve-request-blade__date-time'], 'u-mb-32')}
					errors={[errors.accessFrom?.message]}
					label={t(
						'modules/cp/components/approve-request-blade/approve-request-blade___van'
					)}
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
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onFromDateChange(date, field)}
										value={formatApproveRequestAccessDate(field.value)}
										selected={field.value}
										customInput={
											<TextInput iconStart={<Icon name="calendar" />} />
										}
									/>

									<Timepicker
										{...timepicker}
										maxTime={endOfDay(now)}
										minTime={defaultAccessFrom(now)}
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onFromDateChange(date, field)}
										value={formatApproveRequestAccessTime(field.value)}
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
					label={t(
						'modules/cp/components/approve-request-blade/approve-request-blade___tot'
					)}
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
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onSimpleDateChange(date, field)}
										value={formatApproveRequestAccessDate(field.value)}
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
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onSimpleDateChange(date, field)}
										value={formatApproveRequestAccessTime(field.value)}
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
					label={t(
						'modules/cp/components/approve-request-blade/approve-request-blade___opmerkingen'
					)}
					suffix={OPTIONAL_LABEL()}
				>
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

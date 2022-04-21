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
	roundToNearestMinutes,
	startOfDay,
} from 'date-fns';
import { useTranslation } from 'next-i18next';
import React, { FC, useEffect } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';

import { Blade, Icon, VisitSummary } from '@shared/components';
import { Datepicker } from '@shared/components/Datepicker';
import { Timepicker } from '@shared/components/Timepicker';
import { OPTIONAL_LABEL } from '@shared/const';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types';
import { asDate, formatDate, formatTime } from '@shared/utils';
import { VisitsService } from '@visits/services/visits/visits.service';

import { APPROVE_REQUEST_FORM_SCHEMA } from './ApproveRequestBlade.const';
import styles from './ApproveRequestBlade.module.scss';
import { ApproveRequestBladeProps, ApproveRequestFormState } from './ApproveRequestBlade.types';

const roundToNearestQuarter = (date: Date) => roundToNearestMinutes(date, { nearestTo: 15 });
const defaultAccessFrom = (start: Date) => roundToNearestQuarter(start);
const defaultAccessTo = (accessFrom: Date) => addHours(roundToNearestQuarter(accessFrom), 1);

const ApproveRequestBlade: FC<ApproveRequestBladeProps> = (props) => {
	const { t } = useTranslation();
	const {
		selected,
		onClose,
		onSubmit,
		title = t(
			'modules/cp/components/approve-request-blade/approve-request-blade___aanvraag-goedkeuren'
		),
		approveButtonLabel = t(
			'modules/cp/components/approve-request-blade/approve-request-blade___keur-goed'
		),
		successTitle = t(
			'modules/cp/components/approve-request-blade/approve-request-blade___de-aanvraag-is-goedgekeurd'
		),
		successDescription = t(
			'modules/cp/components/approve-request-blade/approve-request-blade___deze-aanvraag-werd-succesvol-goedgekeurd'
		),
	} = props;

	const {
		control,
		formState: { errors },
		handleSubmit,
		getValues,
		setValue,
		reset,
	} = useForm<ApproveRequestFormState>({
		resolver: yupResolver(APPROVE_REQUEST_FORM_SCHEMA()),
		defaultValues: {
			accessFrom: asDate(selected?.startAt) || defaultAccessFrom(new Date()),
			accessTo: asDate(selected?.endAt) || defaultAccessTo(new Date()),
		},
	});

	useEffect(() => {
		if (selected) {
			selected.note && setValue('accessRemark', selected.note);
			selected.endAt && setValue('accessTo', asDate(selected.endAt));
			selected.startAt && setValue('accessFrom', asDate(selected.startAt));
		}
	}, [selected, setValue]);

	useEffect(() => {
		props.isOpen && reset();
	}, [props.isOpen, reset]);

	// Events

	const onFormSubmit = (values: ApproveRequestFormState) => {
		selected &&
			VisitsService.patchById(selected.id, {
				...selected,
				status: VisitStatus.APPROVED,
				startAt: values.accessFrom?.toISOString(),
				endAt: values.accessTo?.toISOString(),
				note: values.accessRemark, // TODO check throughput
			}).then(() => {
				onSubmit?.(values);

				toastService.notify({
					title: successTitle as string,
					description: successDescription as string,
				});

				reset();
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
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={approveButtonLabel}
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
		<Blade {...props} footer={renderFooter()} title={title}>
			{selected && <VisitSummary {...selected} />}

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

							// Disabled by request of Ineke, 21/03/2022
							// https://meemoo.atlassian.net/browse/ARC-652 + https://github.com/viaacode/hetarchief-client/pull/193
							// const minTime =
							// 	field.value && !isSameDay(field.value, now)
							// 		? defaultAccessFrom(startOfDay(field.value))
							// 		: defaultAccessFrom(now);

							return (
								<>
									<Datepicker
										{...futureDatepicker}
										maxDate={null}
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onFromDateChange(date, field)}
										value={formatDate(field.value)}
										selected={field.value}
										customInput={
											<TextInput iconStart={<Icon name="calendar" />} />
										}
									/>

									<Timepicker
										{...timepicker}
										maxTime={endOfDay(field.value || now)}
										minTime={startOfDay(field.value || now)}
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onFromDateChange(date, field)}
										value={formatTime(field.value)}
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

							// Disabled by request of Ineke, 21/03/2022
							// https://meemoo.atlassian.net/browse/ARC-652 + https://github.com/viaacode/hetarchief-client/pull/193
							// const minTime =
							// 	field.value && accessFrom && isSameDay(field.value, accessFrom)
							// 		? addHours(accessFrom || now, 1)
							// 		: startOfDay(field.value || now);

							return (
								<>
									<Datepicker
										{...futureDatepicker}
										maxDate={null}
										minDate={accessFrom}
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onSimpleDateChange(date, field)}
										value={formatDate(field.value)}
										selected={field.value}
										customInput={
											<TextInput iconStart={<Icon name="calendar" />} />
										}
									/>

									<Timepicker
										{...timepicker}
										maxTime={endOfDay(field.value || now)}
										minTime={startOfDay(field.value || now)}
										name={field.name}
										onBlur={field.onBlur}
										onChange={(date) => onSimpleDateChange(date, field)}
										value={formatTime(field.value)}
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

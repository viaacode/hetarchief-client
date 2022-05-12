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
	differenceInMinutes,
	endOfDay,
	roundToNearestMinutes,
	startOfDay,
	subMinutes,
} from 'date-fns';
import { useTranslation } from 'next-i18next';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
const defaultAccessTo = (accessFrom: Date) => addHours(startOfDay(accessFrom), 18);

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

	const defaultValues = useMemo(
		() => ({
			accessFrom: asDate(selected?.startAt) || defaultAccessFrom(new Date()),
			accessTo: asDate(selected?.endAt) || defaultAccessTo(new Date()),
			accessRemark: selected?.note?.note || undefined,
		}),
		[selected]
	);

	const [form, setForm] = useState<ApproveRequestFormState>(defaultValues);

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<ApproveRequestFormState>({
		resolver: yupResolver(APPROVE_REQUEST_FORM_SCHEMA()),
		defaultValues,
	});

	// We're using useState to store our form and an effect to synchronise it with useForm
	const reset = useCallback(() => {
		setForm(defaultValues);
	}, [defaultValues]);

	useEffect(() => {
		selected &&
			setForm({
				accessFrom: asDate(selected.startAt) || defaultValues.accessFrom,
				accessTo: asDate(selected.endAt) || defaultValues.accessTo,
				accessRemark: selected.note?.note || defaultValues.accessRemark,
			});
	}, [selected, defaultValues, setForm]);

	useEffect(() => {
		setValue('accessFrom', form.accessFrom);
		setValue('accessTo', form.accessTo);
		setValue('accessRemark', form.accessRemark);
	}, [form, setValue]);

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

	const onSimpleDateChange = useCallback(
		(
			date: Date | null,
			field:
				| ControllerRenderProps<ApproveRequestFormState, 'accessTo'>
				| ControllerRenderProps<ApproveRequestFormState, 'accessFrom'>
		) => {
			field.onChange(date);
			setForm((original) => ({
				...original,
				[field.name]: date || undefined,
			}));
		},
		[setForm]
	);

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

	const renderAccessFrom = useCallback(
		({ field }: { field: ControllerRenderProps<ApproveRequestFormState, 'accessFrom'> }) => {
			const now = new Date();

			const onFromDateChange = (
				date: Date | null,
				field: ControllerRenderProps<ApproveRequestFormState, 'accessFrom'>
			) => {
				onSimpleDateChange(date, field);

				const { accessTo } = form;

				if (date && accessTo) {
					// if difference is negative => start time is after end time
					const difference = differenceInMinutes(accessTo, date);

					if (difference <= 0) {
						// 6PM, today
						setForm((original) => ({
							...original,
							accessTo: defaultAccessTo(date),
						}));
					} else if (difference < 60) {
						// 1h in the future
						// Aligns with `minTime` of the `accessTo` `Timepicker`-component
						setForm((original) => ({
							...original,
							accessTo: addHours(subMinutes(defaultAccessTo(date), difference), 1),
						}));
					}
				}
			};

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
						value={formatDate(form.accessFrom)}
						selected={form.accessFrom}
						customInput={<TextInput iconStart={<Icon name="calendar" />} />}
					/>

					<Timepicker
						{...timepicker}
						maxTime={endOfDay(field.value || now)}
						minTime={startOfDay(field.value || now)}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onFromDateChange(date, field)}
						value={formatTime(form.accessFrom)}
						selected={form.accessFrom}
						customInput={<TextInput iconStart={<Icon name="clock" />} />}
					/>
				</>
			);
		},
		[form, onSimpleDateChange]
	);

	const renderAccessTo = useCallback(
		({ field }: { field: ControllerRenderProps<ApproveRequestFormState, 'accessTo'> }) => {
			const { accessFrom } = form;
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
						value={formatDate(form.accessTo)}
						selected={form.accessTo}
						customInput={<TextInput iconStart={<Icon name="calendar" />} />}
					/>

					<Timepicker
						{...timepicker}
						maxTime={endOfDay(field.value || now)}
						minTime={startOfDay(field.value || now)}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onSimpleDateChange(date, field)}
						value={formatTime(form.accessTo)}
						selected={form.accessTo}
						customInput={<TextInput iconStart={<Icon name="clock" />} />}
					/>
				</>
			);
		},
		[form, onSimpleDateChange]
	);

	const renderAccessRemark = ({
		field,
	}: {
		field: ControllerRenderProps<ApproveRequestFormState, 'accessRemark'>;
	}) => <TextInput {...field} />;

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
					<Controller name="accessFrom" control={control} render={renderAccessFrom} />
				</FormControl>

				<FormControl
					className={clsx(styles['c-approve-request-blade__date-time'], 'u-mb-32')}
					errors={[errors.accessTo?.message]}
					label={t(
						'modules/cp/components/approve-request-blade/approve-request-blade___tot'
					)}
				>
					<Controller name="accessTo" control={control} render={renderAccessTo} />
				</FormControl>

				<FormControl
					label={t(
						'modules/cp/components/approve-request-blade/approve-request-blade___opmerkingen'
					)}
					suffix={OPTIONAL_LABEL()}
				>
					<Controller name="accessRemark" control={control} render={renderAccessRemark} />
				</FormControl>
			</div>
		</Blade>
	);
};

export default ApproveRequestBlade;

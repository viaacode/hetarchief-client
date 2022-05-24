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
	areIntervalsOverlapping,
	differenceInMinutes,
	endOfDay,
	isSameDay,
	roundToNearestMinutes,
	startOfDay,
} from 'date-fns';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';

import { Permission } from '@account/const';
import { Blade, Icon, VisitSummary } from '@shared/components';
import { Datepicker } from '@shared/components/Datepicker';
import { Timepicker } from '@shared/components/Timepicker';
import { OPTIONAL_LABEL, ROUTE_PARTS } from '@shared/const';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
import { asDate, formatDate, formatMediumDateWithTime, formatTime } from '@shared/utils';
import { VisitsService } from '@visits/services/visits/visits.service';
import { VisitTimeframe } from '@visits/types';

import { APPROVE_REQUEST_FORM_SCHEMA } from './ApproveRequestBlade.const';
import styles from './ApproveRequestBlade.module.scss';
import { ApproveRequestBladeProps, ApproveRequestFormState } from './ApproveRequestBlade.types';

const roundToNearestQuarter = (date: Date) => roundToNearestMinutes(date, { nearestTo: 15 });
const defaultAccessFrom = (start: Date) => roundToNearestQuarter(start);
const defaultAccessTo = (accessFrom: Date) => {
	let hoursUntilNext1800 = 18; // Same day 18:00
	if (accessFrom.getHours() >= 18) {
		hoursUntilNext1800 += 24; // Next day 18:00
	}
	return addHours(startOfDay(accessFrom), hoursUntilNext1800);
};

const ApproveRequestBlade: FC<ApproveRequestBladeProps> = (props) => {
	const { t } = useTranslation();
	const canViewAddVisitRequests: boolean = useHasAnyPermission(
		Permission.READ_ALL_VISIT_REQUESTS
	);
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
	const [overlappingRequests, setOverlappingRequests] = useState<Visit[]>([]);

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

	const checkOverlappingRequests = useCallback(async (): Promise<Visit[]> => {
		const visitResponse = await VisitsService.getAll(
			undefined,
			VisitStatus.APPROVED,
			[VisitTimeframe.ACTIVE, VisitTimeframe.FUTURE],
			1,
			20,
			'startAt',
			OrderDirection.desc,
			true
		);
		const overlappingRequests = visitResponse.items
			.filter(
				(visit) =>
					visit.spaceSlug === selected?.spaceSlug &&
					areIntervalsOverlapping(
						{
							start: form.accessFrom as Date,
							end: form.accessTo as Date,
						},
						{
							start: asDate(visit.startAt as string) as Date,
							end: asDate(visit.endAt as string) as Date,
						}
					)
			)
			.filter((visit) => visit.id !== selected?.id);

		setOverlappingRequests(overlappingRequests);

		return overlappingRequests;
	}, [selected?.id, form.accessFrom, form.accessTo]);

	useEffect(() => {
		checkOverlappingRequests();
	}, [checkOverlappingRequests]);

	/**
	 * Events
	 */

	const onFormSubmit = async (values: ApproveRequestFormState) => {
		const overlappingVisitRequests = await checkOverlappingRequests();
		if (overlappingVisitRequests.length) {
			toastService.notify({
				title: t(
					'modules/shared/components/approve-request-blade/approve-request-blade___conflict'
				),
				description: t(
					'modules/shared/components/approve-request-blade/approve-request-blade___je-kan-geen-2-aanvragen-goedkeuren-die-overlappen-pas-de-andere-aanvraag-aan'
				),
			});
			return;
		}
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
					const minimum = 60;

					// if difference is negative => start time is after end time
					const difference = differenceInMinutes(accessTo, date);

					// 1h in the future
					// Aligns with `minTime` of the `accessTo` `Timepicker`-component
					const oneHour = (date: Date) =>
						setForm((original) => ({
							...original,
							accessTo: addHours(roundToNearestQuarter(date), 1),
						}));

					if (difference <= 0 && !isSameDay(accessTo, date)) {
						// 6PM on the selected accessFrom
						const sixPM = defaultAccessTo(date);

						if (differenceInMinutes(sixPM, date) >= minimum) {
							// at least an hour, set to sixPM
							setForm((original) => ({
								...original,
								accessTo: sixPM,
							}));
						} else {
							// less than an hour, set to accessFrom + 1h
							oneHour(date);
						}
					} else if (difference < minimum) {
						// less than an hour, set to accessFrom + 1h
						oneHour(date);
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

				{!!overlappingRequests.length && (
					<p className={clsx('c-form-control__errors', styles['c-form-control__errors'])}>
						{t(
							'modules/shared/components/approve-request-blade/approve-request-blade___er-is-reeds-een-goedgekeurde-aanvraag-voor-deze-periode'
						)}
						<br />
						<br />
						{formatMediumDateWithTime(asDate(overlappingRequests[0].startAt))}
						{' - '}
						{formatMediumDateWithTime(asDate(overlappingRequests[0].endAt))}
						<br />
						<br />
						<Link
							href={
								canViewAddVisitRequests
									? `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitRequests}?${ROUTE_PARTS.visitRequest}=${overlappingRequests[0].id}`
									: `/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.visitRequests}?${ROUTE_PARTS.visitRequest}=${overlappingRequests[0].id}`
							}
							passHref
						>
							<a onClick={onClose}>
								{t(
									'modules/shared/components/approve-request-blade/approve-request-blade___bekijk-deze-aanvraag'
								)}
							</a>
						</Link>
					</p>
				)}

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

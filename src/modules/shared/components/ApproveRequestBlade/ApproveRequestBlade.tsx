import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	FormControl,
	futureDatepicker,
	OrderDirection,
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
import { isEmpty, isEqual } from 'lodash';
import Link from 'next/link';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, FieldError, useForm } from 'react-hook-form';

import { Permission } from '@account/const';
import { useGetFolders } from '@account/hooks/get-folders';
import {
	Blade,
	Icon,
	IconNamesLight,
	RefinableRadioButton,
	RefinableRadioButtonOption,
} from '@shared/components';
import { Datepicker } from '@shared/components/Datepicker';
import { Timepicker } from '@shared/components/Timepicker';
import { OPTIONAL_LABEL, ROUTE_PARTS } from '@shared/const';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { AccessType, Visit, VisitStatus } from '@shared/types';
import { asDate, formatMediumDate, formatMediumDateWithTime, formatTime } from '@shared/utils';
import { VisitsService } from '@visits/services/visits/visits.service';
import { VisitTimeframe } from '@visits/types';

import { APPROVE_REQUEST_FORM_SCHEMA } from './ApproveRequestBlade.const';
import styles from './ApproveRequestBlade.module.scss';
import { ApproveRequestBladeProps, ApproveRequestFormState } from './ApproveRequestBlade.types';

const labelKeys: Record<keyof ApproveRequestFormState, string> = {
	accessFrom: 'ApproveRequestBlade__accessFrom',
	accessRemark: 'ApproveRequestBlade__accessRemark',
	accessTo: 'ApproveRequestBlade__accessTo',
	accessType: 'ApproveRequestBlade__accessType',
};

const roundToNearestQuarter = (date: Date) => roundToNearestMinutes(date, { nearestTo: 15 });
const defaultAccessFrom = (start: Date) => roundToNearestQuarter(start);
const defaultAccessTo = (accessFrom: Date) => {
	let hoursUntilNext1800 = 18; // Same day 18:00
	if (accessFrom.getHours() >= 18) {
		hoursUntilNext1800 += 24; // Next day 18:00
	}
	return addHours(startOfDay(accessFrom), hoursUntilNext1800);
};
const defaultAccessType = {
	type: AccessType.FULL,
	folderIds: [],
};

const ApproveRequestBlade: FC<ApproveRequestBladeProps> = (props) => {
	const { tHtml, tText } = useTranslation();
	const canViewAddVisitRequests: boolean = useHasAnyPermission(
		Permission.READ_ALL_VISIT_REQUESTS
	);
	const { data: folders } = useGetFolders();

	const [accessTypeLabel, setAccessTypeLabel] = useState(
		tText('modules/cp/components/approve-request-blade/approve-request-blade___kies-een-map')
	);

	const {
		selected,
		onClose,
		onSubmit,
		title = tHtml(
			'modules/cp/components/approve-request-blade/approve-request-blade___aanvraag-goedkeuren'
		),
		approveButtonLabel = tHtml(
			'modules/cp/components/approve-request-blade/approve-request-blade___keur-goed'
		),
		successTitle = tHtml(
			'modules/cp/components/approve-request-blade/approve-request-blade___de-aanvraag-is-goedgekeurd'
		),
		successDescription = tHtml(
			'modules/cp/components/approve-request-blade/approve-request-blade___deze-aanvraag-werd-succesvol-goedgekeurd'
		),
	} = props;

	const accessTypeOptions: RefinableRadioButtonOption[] = useMemo(
		() => [
			{
				id: AccessType.FULL,
				label: tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___toegang-tot-de-volledige-collectie'
				),
			},
			{
				id: AccessType.FOLDERS,
				label: tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___toegang-tot-een-deel-van-collectie'
				),
				refine: {
					info: tText(
						'modules/cp/components/approve-request-blade/approve-request-blade___mappen-dienen-op-voorhand-gemaakt-te-worden'
					),
					options: (folders?.items || []).map(
						({ id, name }): RefinableRadioButtonOption => ({
							id,
							label: name,
						})
					),
					label: accessTypeLabel,
				},
			},
		],
		[folders, tText, accessTypeLabel]
	);

	const defaultValues = useMemo(
		() => ({
			accessFrom: asDate(selected?.startAt) || defaultAccessFrom(new Date()),
			accessTo: asDate(selected?.endAt) || defaultAccessTo(new Date()),
			accessRemark: selected?.note?.note || undefined,
			accessType: {
				type: selected?.accessType || defaultAccessType.type,
				folderIds: selected?.accessibleFolderIds || defaultAccessType.folderIds,
			},
		}),
		[selected]
	);

	const [form, setForm] = useState<ApproveRequestFormState>(defaultValues);
	const [overlappingRequests, setOverlappingRequests] = useState<Visit[]>([]);

	const {
		control,
		formState: { errors, isSubmitting },
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
				accessType:
					{ type: selected.accessType, folderIds: selected.accessibleFolderIds } ||
					defaultValues.accessType,
			});
	}, [selected, defaultValues, setForm]);

	useEffect(() => {
		setValue('accessFrom', form.accessFrom);
		setValue('accessTo', form.accessTo);
		setValue('accessRemark', form.accessRemark);
		setValue('accessType', form.accessType);
	}, [form, setValue]);

	useEffect(() => {
		props.isOpen && reset();
	}, [props.isOpen, reset]);

	const checkOverlappingRequests = useCallback(async (): Promise<Visit[]> => {
		const visitResponse = await VisitsService.getAll({
			status: VisitStatus.APPROVED,
			timeframe: [VisitTimeframe.ACTIVE, VisitTimeframe.FUTURE],
			requesterId: selected?.userProfileId,
			visitorSpaceSlug: selected?.spaceSlug,
			page: 1,
			size: 40,
			orderProp: 'startAt',
			orderDirection: OrderDirection.desc,
			personal: false,
		});
		const overlappingRequests = visitResponse.items
			.filter((visit) =>
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
	}, [
		selected?.spaceSlug,
		selected?.userProfileId,
		selected?.id,
		form.accessFrom,
		form.accessTo,
	]);

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
				title: tHtml(
					'modules/shared/components/approve-request-blade/approve-request-blade___conflict'
				),
				description: tHtml(
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
				accessType: values.accessType?.type,
				...(!isEmpty(values.accessType.folderIds) && {
					accessFolderIds: values.accessType.folderIds,
				}),
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
			setForm((original) => ({
				...original,
				[field.name]: date || undefined,
			}));
		},
		[setForm]
	);

	const onChangeAccessType = useCallback(
		(
			field: ControllerRenderProps<ApproveRequestFormState, 'accessType'>,
			selectedOption: AccessType,
			selectedRefineOptions: string[],
			isDropdownOpen: boolean
		): void => {
			const { accessType } = form;

			const updatedAccessType = {
				type: selectedOption,
				folderIds: selectedRefineOptions,
			};

			setAccessTypeLabel(
				selectedRefineOptions.length > 0
					? isDropdownOpen
						? tText(
								'modules/cp/components/approve-request-blade/approve-request-blade___er-zijn-meerdere-mappen-geselecteerd'
						  )
						: tText(
								'modules/cp/components/approve-request-blade/approve-request-blade___er-zijn-x-aantal-mappen-geselecteerd',
								{
									count: selectedRefineOptions.length,
								}
						  )
					: tText(
							'modules/cp/components/approve-request-blade/approve-request-blade___kies-een-map'
					  )
			);

			if (isEqual(accessType, updatedAccessType)) {
				return;
			}

			setForm((original) => ({
				...original,
				[field.name]: updatedAccessType,
			}));
		},
		[form, tText]
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
					disabled={isSubmitting}
				/>

				<Button
					label={tHtml(
						'modules/cp/components/approve-request-blade/approve-request-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={onClose}
				/>
			</div>
		);
	};

	const futureDatepickerProps = useMemo(() => {
		const copy = { ...futureDatepicker };

		// Warning: including `maxDate` in any way destroys keyboard navigation
		// See https://stackoverflow.com/a/63564880
		delete copy.maxDate;

		return copy;
	}, []);

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
						{...futureDatepickerProps}
						customInput={
							<TextInput iconStart={<Icon name={IconNamesLight.Calendar} />} />
						}
						id={labelKeys.accessFrom}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onFromDateChange(date, field)}
						selected={form.accessFrom}
						value={formatMediumDate(form.accessFrom)}
						popperPlacement="bottom-start"
					/>

					<Timepicker
						{...timepicker}
						customInput={<TextInput iconStart={<Icon name={IconNamesLight.Clock} />} />}
						id={labelKeys.accessFrom}
						maxTime={endOfDay(field.value || now)}
						minTime={startOfDay(field.value || now)}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onFromDateChange(date, field)}
						selected={form.accessFrom}
						value={formatTime(form.accessFrom)}
						popperPlacement="bottom-start"
					/>
				</>
			);
		},
		[form, onSimpleDateChange, futureDatepickerProps]
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
						{...futureDatepickerProps}
						customInput={
							<TextInput iconStart={<Icon name={IconNamesLight.Calendar} />} />
						}
						id={labelKeys.accessTo}
						minDate={accessFrom}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onSimpleDateChange(date, field)}
						selected={form.accessTo}
						value={formatMediumDate(form.accessTo)}
						popperPlacement="bottom-start"
					/>

					<Timepicker
						{...timepicker}
						customInput={<TextInput iconStart={<Icon name={IconNamesLight.Clock} />} />}
						id={labelKeys.accessTo}
						maxTime={endOfDay(field.value || now)}
						minTime={startOfDay(field.value || now)}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onSimpleDateChange(date, field)}
						selected={form.accessTo}
						value={formatTime(form.accessTo)}
						popperPlacement="bottom-start"
					/>
				</>
			);
		},
		[form, onSimpleDateChange, futureDatepickerProps]
	);

	const renderAccessRemark = ({
		field,
	}: {
		field: ControllerRenderProps<ApproveRequestFormState, 'accessRemark'>;
	}) => (
		<TextInput
			{...field}
			id={labelKeys.accessRemark}
			onChange={(evt) =>
				setForm((original) => {
					return {
						...original,
						accessRemark: evt.target.value,
					};
				})
			}
		/>
	);

	const renderAccessType = useCallback(
		({ field }: { field: ControllerRenderProps<ApproveRequestFormState, 'accessType'> }) => {
			const { accessType } = form;
			const initialState = {
				selectedOption: accessType.type,
				refinedSelection: accessType.folderIds,
			};

			return (
				<RefinableRadioButton
					initialState={initialState}
					options={accessTypeOptions}
					onChange={(
						selectedOption: string,
						selectedRefineOptions: string[],
						isDropdownOpen
					) =>
						onChangeAccessType(
							field,
							selectedOption as AccessType,
							selectedRefineOptions,
							isDropdownOpen
						)
					}
				/>
			);
		},
		[accessTypeOptions, onChangeAccessType, form]
	);

	return (
		<Blade
			{...props}
			footer={props.isOpen && renderFooter()}
			renderTitle={(props) => <h3 {...props}>{title}</h3>}
		>
			{props.isOpen && (
				<div className="u-px-32">
					<FormControl
						className={clsx(styles['c-approve-request-blade__access-type'], 'u-mb-32')}
						errors={[
							errors.accessType?.type?.message,
							(errors.accessType?.folderIds as FieldError | undefined)?.message,
						]}
						id={labelKeys.accessType}
						label={tHtml(
							'modules/cp/components/approve-request-blade/approve-request-blade___type'
						)}
					>
						<Controller name="accessType" control={control} render={renderAccessType} />
					</FormControl>

					<FormControl
						className={clsx(styles['c-approve-request-blade__date-time'], 'u-mb-32')}
						errors={[errors.accessFrom?.message]}
						id={labelKeys.accessFrom}
						label={tHtml(
							'modules/cp/components/approve-request-blade/approve-request-blade___van'
						)}
					>
						<Controller name="accessFrom" control={control} render={renderAccessFrom} />
					</FormControl>

					<FormControl
						className={clsx(styles['c-approve-request-blade__date-time'], 'u-mb-32')}
						errors={[errors.accessTo?.message]}
						id={labelKeys.accessTo}
						label={tHtml(
							'modules/cp/components/approve-request-blade/approve-request-blade___tot'
						)}
					>
						<Controller name="accessTo" control={control} render={renderAccessTo} />
					</FormControl>

					{!!overlappingRequests.length && (
						<p
							className={clsx(
								'c-form-control__errors',
								styles['c-form-control__errors']
							)}
						>
							{tHtml(
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
								<a
									onClick={onClose}
									aria-label={tText(
										'modules/shared/components/approve-request-blade/approve-request-blade___navigeer-naar-de-reeds-goedgekeurde-aanvraag-voor-deze-periode'
									)}
								>
									{tHtml(
										'modules/shared/components/approve-request-blade/approve-request-blade___bekijk-deze-aanvraag'
									)}
								</a>
							</Link>
						</p>
					)}

					<FormControl
						id={labelKeys.accessRemark}
						label={tHtml(
							'modules/cp/components/approve-request-blade/approve-request-blade___opmerkingen'
						)}
						suffix={OPTIONAL_LABEL()}
					>
						<Controller
							name="accessRemark"
							control={control}
							render={renderAccessRemark}
						/>
					</FormControl>
				</div>
			)}
		</Blade>
	);
};

export default ApproveRequestBlade;

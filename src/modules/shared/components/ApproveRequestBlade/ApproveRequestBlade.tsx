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
	isBefore,
	isSameDay,
	roundToNearestMinutes,
	startOfDay,
	subHours,
} from 'date-fns';
import { isEmpty } from 'lodash';
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
import {
	getAccessToDate,
	roundToNextQuarter,
} from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.helpers';
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

const defaultAccessFrom = (start: Date) => roundToNextQuarter(start);
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
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const {
		selected: visitRequest,
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

	const getInitialValues = useCallback(
		() => ({
			accessFrom: asDate(visitRequest?.startAt) || defaultAccessFrom(new Date()),
			accessTo: asDate(visitRequest?.endAt) || defaultAccessTo(new Date()),
			accessRemark: visitRequest?.note?.note || undefined,
			accessType: {
				type: visitRequest?.accessType || defaultAccessType.type,
				folderIds: visitRequest?.accessibleFolderIds || defaultAccessType.folderIds,
			},
		}),
		[visitRequest]
	);

	const [overlappingRequests, setOverlappingRequests] = useState<Visit[]>([]);

	const {
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		setValue,
		getValues,
		reset,
	} = useForm<ApproveRequestFormState>({
		resolver: yupResolver(APPROVE_REQUEST_FORM_SCHEMA()),
		defaultValues: getInitialValues(),
	});

	useEffect(() => {
		// If the selectedVisitRequest changes, reinitialize the form
		reset(getInitialValues());
	}, [reset, getInitialValues]);

	const getAccessTypeLabel = useCallback(
		(accessType: ApproveRequestFormState['accessType']) => {
			const folderCount = accessType?.folderIds?.length;
			const hasRefineOptions = !!folderCount;
			const hasMultipleRefineOptions = folderCount > 1;

			if (hasRefineOptions && isDropdownOpen) {
				return hasMultipleRefineOptions
					? tText(
							'modules/cp/components/approve-request-blade/approve-request-blade___er-zijn-meerdere-mappen-geselecteerd',
							{
								count: folderCount,
							}
					  )
					: tText(
							'modules/cp/components/approve-request-blade/approve-request-blade___er-is-een-map-geselecteerd'
					  );
			} else if (hasRefineOptions && !isDropdownOpen) {
				return hasMultipleRefineOptions
					? tText(
							'modules/cp/components/approve-request-blade/approve-request-blade___er-zijn-x-aantal-mappen-geselecteerd',
							{
								count: folderCount,
							}
					  )
					: tText(
							'modules/shared/components/approve-request-blade/approve-request-blade___er-is-1-map-geselecteerd'
					  );
			} else {
				return tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___kies-een-map'
				);
			}
		},
		[isDropdownOpen, tText]
	);

	const getAccessTypeOptions = useCallback(
		(accessType: ApproveRequestFormState['accessType']): RefinableRadioButtonOption[] => [
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
					label: getAccessTypeLabel(accessType),
				},
			},
		],
		[getAccessTypeLabel, tText, folders?.items]
	);

	useEffect(() => {
		props.isOpen && reset();
	}, [props.isOpen, reset]);

	const checkOverlappingRequests = useCallback(
		async (formValues: ApproveRequestFormState): Promise<Visit[]> => {
			const visitResponse = await VisitsService.getAll({
				status: VisitStatus.APPROVED,
				timeframe: [VisitTimeframe.ACTIVE, VisitTimeframe.FUTURE],
				requesterId: visitRequest?.userProfileId,
				visitorSpaceSlug: visitRequest?.spaceSlug,
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
							start: formValues.accessFrom as Date,
							end: formValues.accessTo as Date,
						},
						{
							start: asDate(visit.startAt as string) as Date,
							end: asDate(visit.endAt as string) as Date,
						}
					)
				)
				.filter((visit) => visit.id !== visitRequest?.id);

			setOverlappingRequests(overlappingRequests);

			return overlappingRequests;
		},
		[visitRequest?.spaceSlug, visitRequest?.userProfileId, visitRequest?.id]
	);

	useEffect(() => {
		checkOverlappingRequests(getValues());
	}, [checkOverlappingRequests, getValues]);

	/**
	 * Events
	 */

	const onFormSubmit = async (values: Partial<ApproveRequestFormState>) => {
		const overlappingVisitRequests = await checkOverlappingRequests(getValues());
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
		visitRequest &&
			VisitsService.patchById(visitRequest.id, {
				...visitRequest,
				status: VisitStatus.APPROVED,
				startAt: values.accessFrom?.toISOString(),
				endAt: values.accessTo?.toISOString(),
				note: values.accessRemark, // TODO check throughput
				accessType: values.accessType?.type,
				...(!isEmpty(values.accessType?.folderIds) && {
					accessFolderIds: values.accessType?.folderIds,
				}),
			}).then(() => {
				onSubmit?.(values as ApproveRequestFormState);

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
			setValue(field.name, date as Date);
		},
		[setValue]
	);

	const onChangeAccessType = useCallback(
		(
			field: ControllerRenderProps<ApproveRequestFormState, 'accessType'>,
			selectedOption: AccessType,
			selectedRefineOptions: string[],
			newIsDropdownOpen: boolean
		): void => {
			setValue('accessType', {
				type: selectedOption,
				folderIds: selectedRefineOptions,
			});
			setIsDropdownOpen(newIsDropdownOpen);
		},
		[setValue]
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
				newAccessFromDate: Date | null,
				field: ControllerRenderProps<ApproveRequestFormState, 'accessFrom'>
			) => {
				onSimpleDateChange(newAccessFromDate, field);

				if (newAccessFromDate) {
					const newAccessToDate = getAccessToDate(
						newAccessFromDate,
						getValues().accessTo
					);
					if (newAccessToDate) {
						setValue('accessTo', newAccessToDate);
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
						selected={field.value}
						value={formatMediumDate(field.value)}
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
						selected={field.value}
						value={formatTime(field.value)}
						popperPlacement="bottom-start"
					/>
				</>
			);
		},
		[setValue, onSimpleDateChange, futureDatepickerProps]
	);

	const renderAccessTo = useCallback(
		({ field }: { field: ControllerRenderProps<ApproveRequestFormState, 'accessTo'> }) => {
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
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onSimpleDateChange(date, field)}
						selected={field.value}
						value={formatMediumDate(field.value)}
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
						selected={field.value}
						value={formatTime(field.value)}
						popperPlacement="bottom-start"
					/>
				</>
			);
		},
		[onSimpleDateChange, futureDatepickerProps]
	);

	const renderAccessRemark = ({
		field,
	}: {
		field: ControllerRenderProps<ApproveRequestFormState, 'accessRemark'>;
	}) => (
		<TextInput
			{...field}
			id={labelKeys.accessRemark}
			onChange={(evt) => setValue('accessRemark', evt.target.value)}
		/>
	);

	const renderAccessType = useCallback(
		({ field }: { field: ControllerRenderProps<ApproveRequestFormState, 'accessType'> }) => {
			const refinableRadioButtonValue = {
				selectedOption: field.value?.type ?? AccessType.FULL,
				refinedSelection: field.value?.folderIds ?? [],
			};

			return (
				<RefinableRadioButton
					value={refinableRadioButtonValue}
					options={getAccessTypeOptions(field.value)}
					onChange={(
						selectedOption: string,
						selectedRefineOptions: string[],
						newIsDropdownOpen: boolean
					) => {
						onChangeAccessType(
							field,
							selectedOption as AccessType,
							selectedRefineOptions,
							newIsDropdownOpen
						);
					}}
				/>
			);
		},
		[getAccessTypeOptions, onChangeAccessType]
	);

	return (
		<Blade
			{...props}
			footer={props.isOpen && renderFooter()}
			renderTitle={(props) => (
				<h4 {...props} className={styles['c-approve-request-blade__title']}>
					{title}
				</h4>
			)}
		>
			{props.isOpen && !!visitRequest && (
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

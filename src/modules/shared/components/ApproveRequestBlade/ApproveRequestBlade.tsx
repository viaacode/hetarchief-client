import { Permission } from '@account/const';
import { useGetFolders } from '@account/hooks/get-folders';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, TextArea } from '@meemoo/react-components';
import { APPROVE_REQUEST_FORM_SCHEMA } from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.const';
import {
	getAccessToDate,
	roundToNextQuarter,
} from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.helpers';
import type {
	ApproveRequestBladeProps,
	ApproveRequestFormState,
} from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.types';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import MaxLengthIndicator from '@shared/components/FormControl/MaxLengthIndicator';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import {
	RefinableRadioButton,
	type RefinableRadioButtonOption,
} from '@shared/components/RefinableRadioButton';
import { OPTIONAL_LABEL, ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { AccessType, type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { asDate, formatMediumDateWithTime, formatTime } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import { VisitTimeframe } from '@visit-requests/types';
import DateInput from '@visitor-space/components/DateInput/DateInput';
import clsx from 'clsx';
import { addHours, areIntervalsOverlapping, endOfDay, startOfDay } from 'date-fns';
import { isEmpty } from 'lodash-es';
import Link from 'next/link';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { Controller, type ControllerRenderProps, type FieldError, useForm } from 'react-hook-form';

import Timepicker from '../Timepicker/Timepicker';

import styles from './ApproveRequestBlade.module.scss';

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
	const locale = useLocale();
	const canViewAddVisitRequests: boolean = useHasAnyPermission(
		Permission.MANAGE_ALL_VISIT_REQUESTS
	);
	const { data: folders } = useGetFolders();
	const [noFoldersSelectedOnSubmit, setNoFoldersSelectedOnSubmit] = useState(false);

	const {
		selected: visitRequest,
		onClose,
		onSubmit,
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

	const [overlappingRequests, setOverlappingRequests] = useState<VisitRequest[]>([]);

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		reset,
	} = useForm<ApproveRequestFormState>({
		resolver: yupResolver(APPROVE_REQUEST_FORM_SCHEMA()),
		defaultValues: getInitialValues(),
	});

	const isError = !!(
		errors.accessType?.types ||
		errors.accessType?.folderIds ||
		errors.accessFrom ||
		errors.accessTo ||
		errors.accessRemark ||
		noFoldersSelectedOnSubmit ||
		!!overlappingRequests.length
	);

	useEffect(() => {
		// If the selectedVisitRequest changes, reinitialize the form
		reset(getInitialValues());
	}, [reset, getInitialValues]);

	useEffect(() => {
		// reset validation when closed
		if (!props.isOpen) {
			setNoFoldersSelectedOnSubmit(false);
			reset(getInitialValues());
		}
	}, [props.isOpen, getInitialValues, reset]);

	const getAccessTypeLabel = useCallback(
		(accessType: ApproveRequestFormState['accessType']) => {
			const selectedFolders = (folders || []).filter((item) =>
				(accessType?.folderIds || []).includes(item.id)
			);
			const selectedFoldersNames = selectedFolders?.map((folder) => folder.name).join(', ');

			return (
				selectedFoldersNames ||
				tText('modules/cp/components/approve-request-blade/approve-request-blade___kies-een-map')
			);
		},
		[folders]
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
					options: (folders || []).map(
						({ id, name }): RefinableRadioButtonOption => ({
							id,
							label: name,
						})
					),
					label: getAccessTypeLabel(accessType),
				},
			},
		],
		[getAccessTypeLabel, folders]
	);

	const checkOverlappingRequests = useCallback(
		async (formValues: ApproveRequestFormState): Promise<VisitRequest[]> => {
			const visitResponse = await VisitRequestService.getAll({
				status: VisitStatus.APPROVED,
				timeframe: [VisitTimeframe.ACTIVE, VisitTimeframe.FUTURE],
				requesterId: visitRequest?.userProfileId,
				visitorSpaceSlug: visitRequest?.spaceSlug,
				page: 1,
				size: 40,
				orderProp: 'startAt',
				orderDirection: AvoSearchOrderDirection.DESC,
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

		if (values.accessType?.type === AccessType.FOLDERS && !values.accessType?.folderIds?.length) {
			setNoFoldersSelectedOnSubmit(true);
			return;
		}

		visitRequest &&
			VisitRequestService.patchById(visitRequest.id, {
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
			_field: ControllerRenderProps<ApproveRequestFormState, 'accessType'>,
			selectedOption: AccessType,
			selectedRefineOptions: string[]
		): void => {
			setValue('accessType', {
				type: selectedOption,
				folderIds: selectedRefineOptions,
			});
		},
		[setValue]
	);

	// Render

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___keur-goed'
				),
				mobileLabel: tText(
					'modules/shared/components/approve-request-blade/approve-request-blade___keur-goed-mobiel'
				),
				type: 'primary',
				onClick: handleSubmit(onFormSubmit),
			},
			{
				label: tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___annuleer'
				),
				mobileLabel: tText(
					'modules/shared/components/approve-request-blade/approve-request-blade___annuleer-mobiel'
				),
				type: 'secondary',
				onClick: props.onClose,
			},
		];
	};

	const renderAccessFrom = useCallback(
		({ field }: { field: ControllerRenderProps<ApproveRequestFormState, 'accessFrom'> }) => {
			const now = new Date();

			const onFromDateChange = (
				newAccessFromDate: Date | null,
				field: ControllerRenderProps<ApproveRequestFormState, 'accessFrom'>
			) => {
				onSimpleDateChange(newAccessFromDate, field);

				if (newAccessFromDate) {
					const newAccessToDate = getAccessToDate(newAccessFromDate, getValues().accessTo);
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
					<DateInput
						id={labelKeys.accessFrom}
						onBlur={field.onBlur}
						onChange={(date) => onFromDateChange(date, field)}
						value={field.value}
					/>

					<Timepicker
						id={labelKeys.accessFrom}
						maxTime={endOfDay(field.value || now)}
						minTime={startOfDay(field.value || now)}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onFromDateChange(date, field)}
						selected={field.value}
						value={formatTime(field.value)}
					/>
				</>
			);
		},
		[onSimpleDateChange, getValues, setValue]
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
					<DateInput
						id={labelKeys.accessTo}
						onBlur={field.onBlur}
						onChange={(date) => onSimpleDateChange(date, field)}
						value={field.value}
					/>

					<Timepicker
						id={labelKeys.accessTo}
						maxTime={endOfDay(field.value || now)}
						minTime={startOfDay(field.value || now)}
						name={field.name}
						onBlur={field.onBlur}
						onChange={(date) => onSimpleDateChange(date, field)}
						selected={field.value}
						value={formatTime(field.value)}
					/>
				</>
			);
		},
		[onSimpleDateChange]
	);

	const renderAccessRemark = ({
		field,
	}: {
		field: ControllerRenderProps<ApproveRequestFormState, 'accessRemark'>;
	}) => (
		<>
			<TextArea
				{...field}
				id={labelKeys.accessRemark}
				maxLength={300}
				onChange={(evt) => setValue('accessRemark', evt.target.value)}
			/>
			<MaxLengthIndicator maxLength={300} value={field.value} />
		</>
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
					onChange={(selectedOption: string, selectedRefineOptions: string[]) => {
						onChangeAccessType(field, selectedOption as AccessType, selectedRefineOptions);
					}}
				/>
			);
		},
		[getAccessTypeOptions, onChangeAccessType]
	);

	const getOverlappingRequest = () => {
		const text = tText(
			'modules/shared/components/approve-request-blade/approve-request-blade___er-is-reeds-een-goedgekeurde-aanvraag-voor-deze-periode'
		);
		const startAt = formatMediumDateWithTime(asDate(overlappingRequests[0].startAt));
		const endAt = formatMediumDateWithTime(asDate(overlappingRequests[0].endAt));

		return `${text} (${startAt} - ${endAt})`;
	};

	const ROUTE_PARTS = ROUTE_PARTS_BY_LOCALE[locale];
	return (
		<Blade
			{...props}
			isBladeInvalid={isError}
			footerButtons={getFooterButtons()}
			className={styles['c-approve-request-blade']}
		>
			{!!visitRequest && (
				<>
					<FormControl
						className={clsx(styles['c-approve-request-blade__access-type'], 'u-mb-32')}
						errors={[
							<RedFormWarning error={errors.accessType?.message} key="form-error--access-type" />,
							<RedFormWarning
								error={(errors.accessType?.folderIds as FieldError | undefined)?.message}
								key="form-error--access-type-folder-ids"
							/>,
							<RedFormWarning
								error={
									noFoldersSelectedOnSubmit
										? tHtml(
												'modules/shared/components/approve-request-blade/approve-request-blade___selecteer-een-of-meerdere-mappen'
											)
										: null
								}
								key="form-error--no-folder-selected"
							/>,
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
						errors={[
							<RedFormWarning error={errors.accessFrom?.message} key="form-error--access-from" />,
						]}
						id={labelKeys.accessFrom}
						label={tHtml('modules/cp/components/approve-request-blade/approve-request-blade___van')}
					>
						<Controller name="accessFrom" control={control} render={renderAccessFrom} />
					</FormControl>

					<FormControl
						className={clsx(styles['c-approve-request-blade__date-time'], 'u-mb-32')}
						errors={[
							<RedFormWarning error={errors.accessTo?.message} key="form-error--access-to" />,
						]}
						id={labelKeys.accessTo}
						label={tHtml('modules/cp/components/approve-request-blade/approve-request-blade___tot')}
					>
						<Controller name="accessTo" control={control} render={renderAccessTo} />
					</FormControl>

					{!!overlappingRequests.length && (
						<p className={clsx('c-form-control__errors', styles['c-form-control__errors'])}>
							<p>{getOverlappingRequest()}</p>
							<br />
							<Link
								href={
									canViewAddVisitRequests
										? `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitRequests}?${ROUTE_PARTS.visitRequest}=${overlappingRequests[0].id}`
										: `/${ROUTE_PARTS.cpAdmin}/${ROUTE_PARTS.visitRequests}?${ROUTE_PARTS.visitRequest}=${overlappingRequests[0].id}`
								}
								passHref
								onClick={onClose}
								aria-label={tText(
									'modules/shared/components/approve-request-blade/approve-request-blade___navigeer-naar-de-reeds-goedgekeurde-aanvraag-voor-deze-periode'
								)}
							>
								{tHtml(
									'modules/shared/components/approve-request-blade/approve-request-blade___bekijk-deze-aanvraag'
								)}
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
						<Controller name="accessRemark" control={control} render={renderAccessRemark} />
					</FormControl>
				</>
			)}
		</Blade>
	);
};
export default ApproveRequestBlade;

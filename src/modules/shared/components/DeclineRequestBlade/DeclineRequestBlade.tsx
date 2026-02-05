import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import MaxLengthIndicator from '@shared/components/FormControl/MaxLengthIndicator';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { VisitSummary } from '@shared/components/VisitSummary';
import { OPTIONAL_LABEL } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import { type FC, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DECLINE_REQUEST_FORM_SCHEMA } from './DeclineRequestBlade.const';
import type {
	DeclineRequestBladeProps,
	DeclineRequestFormState,
} from './DeclineRequestBlade.types';

const labelKeys: Record<keyof DeclineRequestFormState, string> = {
	reasonForDenial: 'DeclineRequestBlade__reasonForDenial',
};

const DeclineRequestBlade: FC<DeclineRequestBladeProps> = (props) => {
	const { onSubmit, selected } = props;

	const getInitialValues = useCallback(
		() => ({
			reasonForDenial: selected?.note?.note || undefined,
		}),
		[selected]
	);

	const {
		control,
		formState: { errors, isValid },
		setValue,
		handleSubmit,
		reset,
	} = useForm<DeclineRequestFormState>({
		resolver: yupResolver(DECLINE_REQUEST_FORM_SCHEMA()),
		defaultValues: getInitialValues(),
	});

	useEffect(() => {
		// If the selectedVisitRequest changes, reinitialize the form
		props.isOpen && reset(getInitialValues());
	}, [props.isOpen, reset, getInitialValues]);

	const onFormSubmit = (values: DeclineRequestFormState) => {
		selected &&
			VisitRequestService.patchById(selected.id, {
				...selected,
				status: VisitStatus.DENIED,
				note: values.reasonForDenial, // TODO check throughput
			}).then(() => {
				onSubmit?.(values);

				toastService.notify({
					title: tHtml(
						'modules/cp/components/decline-request-blade/decline-request-blade___de-aanvraag-is-afgekeurd'
					),
					description: tHtml(
						'modules/cp/components/decline-request-blade/decline-request-blade___deze-aanvraag-werd-succesvol-afgekeurd'
					),
				});

				reset();
			});
	};

	// Render

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText('modules/cp/components/decline-request-blade/decline-request-blade___keur-af'),
				type: 'primary',
				onClick: handleSubmit(onFormSubmit),
			},
			{
				label: tText(
					'modules/cp/components/decline-request-blade/decline-request-blade___annuleer'
				),
				type: 'secondary',
				onClick: props.onClose,
			},
		];
	};

	return (
		<Blade
			{...props}
			footerButtons={getFooterButtons()}
			isBladeInvalid={!isValid}
			title={tText(
				'modules/cp/components/decline-request-blade/decline-request-blade___aanvraag-afkeuren'
			)}
		>
			{selected && <VisitSummary {...selected} />}

			<FormControl
				errors={[
					<RedFormWarning
						error={errors.reasonForDenial?.message}
						key="form-error--reason-for-denial"
					/>,
				]}
				id={labelKeys.reasonForDenial}
				label={tHtml(
					'modules/cp/components/decline-request-blade/decline-request-blade___reden-voor-afkeuring'
				)}
				suffix={OPTIONAL_LABEL()}
			>
				<Controller
					name="reasonForDenial"
					control={control}
					render={({ field }) => (
						<>
							<TextArea
								{...field}
								id={labelKeys.reasonForDenial}
								maxLength={300}
								onChange={(evt) => setValue('reasonForDenial', evt.target.value)}
							/>
							<MaxLengthIndicator maxLength={300} value={field.value} />
						</>
					)}
				/>
			</FormControl>
		</Blade>
	);
};

export default DeclineRequestBlade;

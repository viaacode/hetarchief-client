import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextArea } from '@meemoo/react-components';
import { type FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Blade } from '@shared/components/Blade/Blade';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { VisitSummary } from '@shared/components/VisitSummary';
import { OPTIONAL_LABEL } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';

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

	const {
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		reset,
	} = useForm<DeclineRequestFormState>({
		resolver: yupResolver(DECLINE_REQUEST_FORM_SCHEMA()),
	});

	useEffect(() => {
		props.isOpen && reset();
	}, [props.isOpen, reset]);

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

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-px-16-md u-py-24">
				<Button
					className="u-mb-16"
					label={tHtml(
						'modules/cp/components/decline-request-blade/decline-request-blade___keur-af'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
					disabled={isSubmitting}
				/>

				<Button
					label={tHtml(
						'modules/cp/components/decline-request-blade/decline-request-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={props.onClose}
				/>
			</div>
		);
	};

	return (
		<Blade
			{...props}
			footer={props.isOpen && renderFooter()}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2 {...props}>
					{tHtml(
						'modules/cp/components/decline-request-blade/decline-request-blade___aanvraag-afkeuren'
					)}
				</h2>
			)}
		>
			{selected && <VisitSummary {...selected} />}

			{props.isOpen && (
				<div className="u-px-32 u-px-16-md">
					<FormControl
						className="u-mb-24"
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
							render={({ field }) => <TextArea {...field} id={labelKeys.reasonForDenial} />}
						/>
					</FormControl>
				</div>
			)}
		</Blade>
	);
};

export default DeclineRequestBlade;

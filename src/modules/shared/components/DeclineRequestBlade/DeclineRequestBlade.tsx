import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextArea } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import React, { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Blade, VisitSummary } from '@shared/components';
import { OPTIONAL_LABEL } from '@shared/const';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types';
import { VisitsService } from '@visits/services/visits/visits.service';

import { DECLINE_REQUEST_FORM_SCHEMA } from './DeclineRequestBlade.const';
import { DeclineRequestBladeProps, DeclineRequestFormState } from './DeclineRequestBlade.types';

const labelKeys: Record<keyof DeclineRequestFormState, string> = {
	reasonForDenial: 'DeclineRequestBlade__reasonForDenial',
};

const DeclineRequestBlade: FC<DeclineRequestBladeProps> = (props) => {
	const { t } = useTranslation();
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
			VisitsService.patchById(selected.id, {
				...selected,
				status: VisitStatus.DENIED,
				note: values.reasonForDenial, // TODO check throughput
			}).then(() => {
				onSubmit?.(values);

				toastService.notify({
					title: t(
						'modules/cp/components/decline-request-blade/decline-request-blade___de-aanvraag-is-afgekeurd'
					),
					description: t(
						'modules/cp/components/decline-request-blade/decline-request-blade___deze-aanvraag-werd-succesvol-afgekeurd'
					),
				});

				reset();
			});
	};

	// Render

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={t(
						'modules/cp/components/decline-request-blade/decline-request-blade___keur-af'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
					disabled={isSubmitting}
				/>

				<Button
					label={t(
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
			footer={renderFooter()}
			title={t(
				'modules/cp/components/decline-request-blade/decline-request-blade___aanvraag-afkeuren'
			)}
		>
			{selected && <VisitSummary {...selected} />}
			<div className="u-px-32">
				<FormControl
					className="u-mb-24"
					errors={[errors.reasonForDenial?.message]}
					id={labelKeys.reasonForDenial}
					label={t(
						'modules/cp/components/decline-request-blade/decline-request-blade___reden-voor-afkeuring'
					)}
					suffix={OPTIONAL_LABEL()}
				>
					<Controller
						name="reasonForDenial"
						control={control}
						render={({ field }) => (
							<TextArea {...field} id={labelKeys.reasonForDenial} />
						)}
					/>
				</FormControl>
			</div>
		</Blade>
	);
};

export default DeclineRequestBlade;

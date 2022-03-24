import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextArea } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Blade } from '@shared/components';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types';
import { VisitsService } from '@visits/services/visits/visits.service';

import { DECLINE_REQUEST_FORM_SCHEMA } from './DeclineRequestBlade.const';
import { DeclineRequestBladeProps, DeclineRequestFormState } from './DeclineRequestBlade.types';

const DeclineRequestBlade: FC<DeclineRequestBladeProps> = (props) => {
	const { onSubmit, selected } = props;

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<DeclineRequestFormState>({
		resolver: yupResolver(DECLINE_REQUEST_FORM_SCHEMA()),
	});
	const { t } = useTranslation();

	const onFormSubmit = (values: DeclineRequestFormState) => {
		selected &&
			VisitsService.patchById(selected.id, {
				...selected,
				status: VisitStatus.DENIED,
				// TODO: reason
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

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					label={t(
						'modules/cp/components/decline-request-blade/decline-request-blade___keur-af'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
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
			<div className="u-px-32">
				<FormControl
					className="u-mb-24"
					errors={[errors.reasonForDenial?.message]}
					label={t(
						'modules/cp/components/decline-request-blade/decline-request-blade___reden-voor-afkeuring'
					)}
				>
					<Controller
						name="reasonForDenial"
						control={control}
						render={({ field }) => <TextArea {...field} />}
					/>
				</FormControl>
			</div>
		</Blade>
	);
};

export default DeclineRequestBlade;

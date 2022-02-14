import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, TextArea } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Blade } from '@shared/components';

import { DECLINE_REQUEST_FORM_SCHEMA } from './DeclineRequestBlade.const';
import { DeclineRequestBladeProps, DeclineRequestFormState } from './DeclineRequestBlade.types';

const DeclineRequestBlade: FC<DeclineRequestBladeProps> = (props) => {
	const { onSubmit } = props;

	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<DeclineRequestFormState>({
		resolver: yupResolver(DECLINE_REQUEST_FORM_SCHEMA()),
	});
	const { t } = useTranslation();

	const onFormSubmit = (values: DeclineRequestFormState) => {
		// TODO: replace with save-to-db
		Promise.resolve().then(() => {
			onSubmit?.(values);
		});
	};

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-16">
				<Button
					label={t('Keur af')}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
				/>

				<Button
					label={t('Annuleer')}
					variants={['block', 'text']}
					onClick={props.onClose}
				/>
			</div>
		);
	};

	return (
		<Blade {...props} footer={renderFooter()} title={t('Aanvraag afkeuren')}>
			<div className="u-px-32">
				<FormControl
					className="u-mb-24"
					errors={[errors.reasonForDenial?.message]}
					label={t('Reden voor afkeuring')}
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

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ContentInput, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { COLLECTION_FORM_SCHEMA } from '@account/const';
import { collectionsService } from '@account/services/collections';
import { CreateCollectionFormState } from '@account/types';
import { Icon } from '@shared/components';
import { toastService } from '@shared/services/toast-service';

import styles from './CreateCollectionButton.module.scss';
import { CreateCollectionButtonProps } from './CreateCollectionButton.types';

const formKeys: Record<keyof CreateCollectionFormState, string> = {
	name: 'CreateCollectionButton__name',
};

const CreateCollectionButton: FC<CreateCollectionButtonProps> = ({
	afterSubmit = () => null,
	onOpenNode = null,
}) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * Form
	 */

	const defaultName = t('pages/account/mijn-mappen/collection-slug/index___nieuwe-map-aanmaken');

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		resetField,
	} = useForm<CreateCollectionFormState>({
		resolver: yupResolver(COLLECTION_FORM_SCHEMA()),
		defaultValues: {
			name: defaultName,
		},
	});

	/**
	 * Events
	 */

	const resetForm = () => {
		resetField('name');
		setIsOpen(false);
	};

	const clearForm = () => {
		setValue('name', '');
		setIsOpen(true);
	};

	const onFormSubmit = () => {
		handleSubmit<CreateCollectionFormState>((values) => {
			collectionsService.create(values).then(() => {
				afterSubmit();

				toastService.notify({
					title: t(
						'modules/account/components/create-collection-button/create-collection-button___name-is-aangemaakt',
						values
					),
					description: t(
						'modules/account/components/create-collection-button/create-collection-button___je-nieuwe-map-is-succesvol-aangemaakt'
					),
				});
			});
		})();
	};

	return (
		<FormControl
			className={clsx(
				styles['c-create-collection-button'],
				'u-px-24',
				'c-form-control--label-hidden'
			)}
			errors={[errors.name?.message]}
			id={formKeys.name}
			label={defaultName}
		>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<ContentInput
						{...field}
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						iconStart={(handler) => {
							return !isOpen ? (
								<Button
									variants={['platinum', 'sm']}
									onClick={handler}
									icon={<Icon name="plus" />}
								/>
							) : (
								onOpenNode
							);
						}}
						id={formKeys.name}
						nodeSubmit={
							<Button variants={['black', 'sm']} icon={<Icon name="check" />} />
						}
						nodeCancel={
							<Button variants={['silver', 'sm']} icon={<Icon name="times" />} />
						}
						onClose={resetForm}
						onConfirm={onFormSubmit}
						onOpen={clearForm}
						placeholder={t(
							'modules/account/components/create-collection-button/create-collection-button___nieuwe-map'
						)}
						spellCheck="false"
						variants={['normal']}
					/>
				)}
			/>
		</FormControl>
	);
};

export default CreateCollectionButton;

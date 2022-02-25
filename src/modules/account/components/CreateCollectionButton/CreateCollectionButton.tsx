import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ContentInput, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CREATE_COLLECTION_FORM_SCHEMA } from '@account/const';
import { collectionsService } from '@account/services/collections';
import { CreateCollectionFormState } from '@account/types';
import { Icon } from '@shared/components';
import { toastService } from '@shared/services';

import styles from './CreateCollectionButton.module.scss';
import { CreateCollectionButtonProps } from './CreateCollectionButton.types';

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
		resolver: yupResolver(CREATE_COLLECTION_FORM_SCHEMA()),
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
						'pages/account/mijn-mappen/collection-slug/index___name-is-aangemaakt',
						values
					),
					description: t(
						'pages/account/mijn-mappen/collection-slug/index___je-nieuwe-map-is-succesvol-aangemaakt'
					),
				});
			});
		})();
	};

	return (
		<FormControl
			className={clsx(styles['c-create-collection-button'], 'u-px-24')}
			errors={[errors.name?.message]}
		>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<ContentInput
						{...field}
						onClose={resetForm}
						onOpen={clearForm}
						onConfirm={onFormSubmit}
						iconStart={
							!isOpen ? (
								<Button variants={['platinum', 'sm']} icon={<Icon name="plus" />} />
							) : (
								onOpenNode
							)
						}
						nodeSubmit={
							<Button variants={['black', 'sm']} icon={<Icon name="check" />} />
						}
						nodeCancel={
							<Button variants={['silver', 'sm']} icon={<Icon name="times" />} />
						}
					/>
				)}
			/>
		</FormControl>
	);
};

export default CreateCollectionButton;

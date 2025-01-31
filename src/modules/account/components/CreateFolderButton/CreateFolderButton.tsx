import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ContentInput, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { CreateFolderButtonProps } from '@account/components';
import { COLLECTION_FORM_SCHEMA } from '@account/const';
import { foldersService } from '@account/services/folders';
import type { CreateFolderFormState } from '@account/types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';

import styles from './CreateFolderButton.module.scss';

const labelKeys: Record<keyof CreateFolderFormState, string> = {
	name: 'CreateFolderButton__name',
};

const CreateFolderButton: FC<CreateFolderButtonProps> = ({
	afterSubmit = () => null,
	onOpenNode = null,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * Form
	 */

	const defaultName = tText('pages/account/mijn-mappen/folder-slug/index___nieuwe-map-aanmaken');

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		resetField,
	} = useForm<CreateFolderFormState>({
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

	const onFormSubmit = async () => {
		return new Promise<void>((resolve, reject) => {
			handleSubmit(async (values) => {
				const folder = await foldersService.create(values);
				afterSubmit(folder);

				toastService.notify({
					title: tHtml(
						'modules/account/components/create-folder-button/create-folder-button___name-is-aangemaakt',
						values
					),
					description: tHtml(
						'modules/account/components/create-folder-button/create-folder-button___je-nieuwe-map-is-succesvol-aangemaakt'
					),
				});
				resolve();
			}, reject)();
		});
	};

	return (
		<FormControl
			className={clsx(
				styles['c-create-folder-button'],
				'u-px-24',
				'c-form-control--label-hidden'
			)}
			errors={[<RedFormWarning error={errors.name?.message} key="form-error--name" />]}
			id={labelKeys.name}
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
									tabIndex={-1}
									variants={['platinum', 'sm']}
									onClick={handler}
									icon={<Icon name={IconNamesLight.Plus} aria-hidden />}
									aria-label={tText(
										'modules/account/components/create-collection-button/create-collection-button___nieuwe-map-aanmaken'
									)}
								/>
							) : (
								onOpenNode
							);
						}}
						id={labelKeys.name}
						nodeSubmit={
							<Button
								tabIndex={-1}
								variants={['black', 'sm']}
								icon={<Icon name={IconNamesLight.Check} aria-hidden />}
								aria-label={tText(
									'modules/account/components/create-collection-button/create-collection-button___nieuwe-map-opslaan'
								)}
							/>
						}
						nodeCancel={
							<Button
								tabIndex={-1}
								variants={['silver', 'sm']}
								icon={<Icon name={IconNamesLight.Times} aria-hidden />}
								aria-label={tText(
									'modules/account/components/create-collection-button/create-collection-button___nieuwe-map-aanmaken-annuleren'
								)}
							/>
						}
						onClose={resetForm}
						onConfirm={onFormSubmit}
						onOpen={clearForm}
						placeholder={tText(
							'modules/account/components/create-folder-button/create-folder-button___nieuwe-map'
						)}
						spellCheck="false"
						variants={['normal']}
					/>
				)}
			/>
		</FormControl>
	);
};

export default CreateFolderButton;

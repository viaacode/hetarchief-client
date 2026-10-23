import type { CreateFolderButtonProps } from '@account/components';
import { COLLECTION_FORM_SCHEMA } from '@account/const';
import { FoldersService } from '@account/services/folders';
import type { CreateFolderFormState } from '@account/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, ContentInput, FormControl } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import styles from './CreateFolderButton.module.scss';

const labelKeys: Record<'name', string> = {
	name: 'CreateFolderButton__name',
};

const CreateFolderButton: FC<CreateFolderButtonProps> = ({
	afterSubmit = () => null,
	onOpenNode = null,
	keepIconWhenOpen = false,
	isOrganisation = false,
	showOrganisationOption = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isOrganisationChecked, setIsOrganisationChecked] = useState(false);

	/**
	 * Form
	 */

	const defaultName = isOrganisation
		? tText(
				'modules/account/components/create-folder-button/create-folder-button___nieuwe-organisatiemap-aanmaken'
			)
		: tText('pages/account/mijn-mappen/folder-slug/index___nieuwe-map-aanmaken');

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
		setIsOrganisationChecked(false);
		setIsOpen(false);
	};

	const clearForm = () => {
		setValue('name', '');
		setIsOpen(true);
	};

	const onFormSubmit = async () => {
		return new Promise<void>((resolve, reject) => {
			handleSubmit(async (values) => {
				const folder = await FoldersService.create({
					name: values.name,
					isOrganisation: isOrganisation || (showOrganisationOption && isOrganisationChecked),
				});
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
			className={clsx(styles['c-create-folder-button'], 'u-px-24', 'c-form-control--label-hidden')}
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
						ariaLabel={tText(
							'modules/account/components/create-folder-button/create-folder-button___nieuwe-map-naam-input-aria-label'
						)}
						autoCapitalize="off"
						autoComplete="off"
						// Password managers ignore autocomplete="off", these keep them from suggesting logins
						data-1p-ignore
						data-lpignore="true"
						data-bwignore
						data-form-type="other"
						autoCorrect="off"
						iconStart={(handler) => {
							return !isOpen || keepIconWhenOpen ? (
								<Button
									tabIndex={-1}
									variants={['platinum', 'sm']}
									onClick={handler}
									icon={<Icon name={IconNamesLight.Plus} aria-hidden />}
									ariaLabel={tText(
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
								ariaLabel={tText(
									'modules/account/components/create-collection-button/create-collection-button___nieuwe-map-opslaan'
								)}
							/>
						}
						nodeCancel={
							<Button
								tabIndex={-1}
								variants={['silver', 'sm']}
								icon={<Icon name={IconNamesLight.Times} aria-hidden />}
								ariaLabel={tText(
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
						spellCheck={false}
						variants={['normal']}
					/>
				)}
			/>
			{showOrganisationOption && !isOrganisation && isOpen && (
				<Checkbox
					className={styles['c-create-folder-button__organisation-checkbox']}
					checked={isOrganisationChecked}
					checkIcon={<Icon name={IconNamesLight.Check} aria-hidden />}
					onChange={(evt) => setIsOrganisationChecked(evt.target.checked)}
					label={tText(
						'modules/account/components/create-folder-button/create-folder-button___deze-map-is-een-organisatiemap'
					)}
				/>
			)}
		</FormControl>
	);
};

export default CreateFolderButton;

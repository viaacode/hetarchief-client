import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	ContentInput,
	FormControl,
	StopPropagationFunction,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { COLLECTION_FORM_SCHEMA } from '@account/const';
import { foldersService } from '@account/services/folders';
import { EditFolderFormState } from '@account/types';
import { Icon } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';

import styles from './EditFolderTitle.module.scss';
import { EditFolderTitleProps } from './EditFolderTitle.types';

const labelKeys: Record<keyof EditFolderFormState, string> = {
	name: 'EditFolderTitle__name',
};

const EditFolderTitle: FC<EditFolderTitleProps> = ({
	afterSubmit = () => null,
	buttons = [],
	folder,
	onOpenNode = null,
}) => {
	const { tHtml, tText } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * Form
	 */

	const defaultName = folder.name;

	const {
		control,
		formState: { errors },
		handleSubmit,
		resetField,
	} = useForm<EditFolderFormState>({
		resolver: yupResolver(COLLECTION_FORM_SCHEMA()),
		defaultValues: {
			name: defaultName,
		},
	});

	/**
	 * Effects
	 */

	useEffect(() => {
		const description = [errors.name?.message].join(' ');
		description.length > 0 &&
			toastService.notify({
				title: tHtml(
					'modules/account/components/edit-folder-title/edit-folder-title___er-was-een-probleem-bij-het-aanpassen-van-de-titel-van-de-map'
				),
				maxLines: 2,
				description,
			});
	}, [errors, tHtml]);

	/**
	 * Events
	 */

	const resetForm = () => {
		resetField('name');
		setIsOpen(false);
	};

	const clearForm = () => {
		setIsOpen(true);
	};

	const onFormSubmit = (): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			handleSubmit<EditFolderFormState>(async (values) => {
				const response = await foldersService.update(folder.id, values);
				await afterSubmit(response);

				toastService.notify({
					title: tHtml(
						'modules/account/components/edit-folder-title/edit-folder-title___name-is-aangepast',
						values
					),
					description: tHtml(
						'modules/account/components/edit-folder-title/edit-folder-title___deze-map-is-successvol-aangepast'
					),
				});
				resolve();
			}, reject)();
		});
	};

	/**
	 * Render
	 */

	const renderButtons = (handler: StopPropagationFunction) => {
		return (
			<>
				{buttons.filter((b) => b.before).map((b) => b.node)}
				<Button
					key={'edit-title'}
					onClick={handler}
					className={styles['c-edit-folder-title__edit']}
					variants={['silver']}
					name={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___map-aanpassen'
					)}
					icon={<Icon name="edit" aria-hidden />}
					aria-label={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___titel-aanpassen'
					)}
				/>
				{buttons.filter((b) => !b.before).map((b) => b.node)}
			</>
		);
	};

	return (
		<FormControl
			className={clsx(styles['c-edit-folder-title'], 'c-form-control--label-hidden')}
			id={labelKeys.name}
			label={tHtml(
				'modules/account/components/edit-folder-title/edit-folder-title___map-aanpassen'
			)}
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
						iconEnd={(handler) => (!isOpen ? renderButtons(handler) : onOpenNode)}
						id={labelKeys.name}
						nodeCancel={
							<Button
								tabIndex={-1}
								variants={['silver']}
								icon={<Icon name="times" aria-hidden />}
								aria-label={tText(
									'modules/account/components/edit-folder-title/edit-folder-title___titel-aanpassen-annuleren'
								)}
							/>
						}
						nodeSubmit={
							<Button
								tabIndex={-1}
								variants={['black']}
								icon={<Icon name="check" aria-hidden />}
								aria-label={tText(
									'modules/account/components/edit-folder-title/edit-folder-title___nieuwe-titel-opslaan'
								)}
							/>
						}
						onClose={resetForm}
						onConfirm={onFormSubmit}
						onOpen={clearForm}
						spellCheck="false"
						variants={['title']}
					/>
				)}
			/>
		</FormControl>
	);
};

export default EditFolderTitle;

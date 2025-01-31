import { Button, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useEffect, useState } from 'react';

import { EDIT_FOLDER_VALIDATION_SCHEMA } from '@account/components/EditFolderBlade/EditFolderBlade.consts';
import { FoldersService } from '@account/services/folders';
import type { Folder } from '@account/types';
import { Blade } from '@shared/components/Blade/Blade';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { toastService } from '@shared/services/toast-service';

import styles from './EditFolderBlade.module.scss';

interface EditFolderBladeProps {
	isOpen: boolean;
	onClose: () => void;
	currentFolder: Folder;
	onSave: (folderInfo: Folder) => Promise<void>;
}

export const EditFolderBlade: FC<EditFolderBladeProps> = ({
	isOpen,
	onClose,
	currentFolder,
	onSave,
}) => {
	const [name, setName] = useState(currentFolder?.name || '');
	const [description, setDescription] = useState(currentFolder?.description || '');

	const [formErrors, setFormErrors] = useState<{
		name?: string;
		description?: string;
	}>({});

	useEffect(() => {
		if (isOpen) {
			setName(currentFolder?.name || '');
			setDescription(currentFolder?.description || '');
		}
	}, [currentFolder, isOpen]);

	const resetForm = () => {
		setName('');
		setDescription('');
		setFormErrors({});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const submitData = async () => {
		try {
			const errors = await validateForm(
				{
					name,
					description,
				},
				EDIT_FOLDER_VALIDATION_SCHEMA()
			);
			if (errors) {
				setFormErrors(errors);
				return;
			}
			const newFolder = {
				...currentFolder,
				name,
				description,
			};
			await FoldersService.update(currentFolder.id, { name, description });

			toastService.notify({
				title: tHtml(
					'modules/account/components/edit-folder-blade/edit-folder-blade___success',
					newFolder
				),
				description: tHtml(
					'modules/account/components/edit-folder-blade/edit-folder-blade___deze-map-is-successvol-aangepast'
				),
			});
			resetForm();
			onSave(newFolder);
			onClose();
		} catch (error) {
			toastService.notify({
				title: tHtml(
					'modules/account/components/edit-folder-blade/edit-folder-blade___er-is-een-fout-opgetreden'
				),
				description: tHtml(
					'modules/account/components/edit-folder-blade/edit-folder-blade___er-is-een-fout-opgetreden-bij-het-aanpassen-van-de-map'
				),
			});
		}
	};

	const renderFooter = () => {
		return (
			<div className={clsx('u-px-32 u-py-24')}>
				<Button
					variants={['block', 'black']}
					onClick={() => submitData()}
					label={tText('modules/account/components/edit-folder-blade/edit-folder-blade___bewaar')}
				/>

				<Button
					variants={['block', 'text']}
					onClick={() => handleClose()}
					label={tText('modules/account/components/edit-folder-blade/edit-folder-blade___sluit')}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h1 {...props} className={clsx(props.className, styles['p-folder-editor__title'])}>
					{tText('modules/account/components/edit-folder-blade/edit-folder-blade___map-aanpassen')}
				</h1>
			)}
			footer={isOpen && renderFooter()}
			onClose={handleClose}
			id="edit-folder-blade"
		>
			<div className={styles['p-folder-editor__content']}>
				<FormControl
					label={tText('modules/account/components/edit-folder-blade/edit-folder-blade___naam')}
					errors={[formErrors.name]}
				>
					<TextInput value={name} onChange={(e) => setName(e.target.value)} />
				</FormControl>
				<FormControl
					label={tText(
						'modules/account/components/edit-folder-blade/edit-folder-blade___beschrijving'
					)}
					errors={[formErrors.description]}
				>
					<TextArea
						className={styles['c-request-material__reason-input']}
						onChange={(e) => setDescription(e.target.value)}
						value={description}
					/>
				</FormControl>
			</div>
		</Blade>
	);
};

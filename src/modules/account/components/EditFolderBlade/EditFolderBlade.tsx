import { EDIT_FOLDER_VALIDATION_SCHEMA } from '@account/components/EditFolderBlade/EditFolderBlade.consts';
import { FoldersService } from '@account/services/folders';
import type { Folder } from '@account/types';
import { FormControl, TextArea, TextInput } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import MaxLengthIndicator from '@shared/components/FormControl/MaxLengthIndicator';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { toastService } from '@shared/services/toast-service';
import { type FC, useEffect, useState } from 'react';

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
			setFormErrors({});
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
		} catch (_error) {
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

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText('modules/account/components/edit-folder-blade/edit-folder-blade___bewaar'),
				mobileLabel: tText('Bewaar mobiel'),
				type: 'primary',
				onClick: () => submitData(),
			},
			{
				label: tText('modules/account/components/edit-folder-blade/edit-folder-blade___sluit'),
				mobileLabel: tText('Sluit mobiel'),
				type: 'secondary',
				onClick: handleClose,
			},
		];
	};

	return (
		<Blade
			isOpen={isOpen}
			title={tText(
				'modules/account/components/edit-folder-blade/edit-folder-blade___map-aanpassen'
			)}
			footerButtons={getFooterButtons()}
			onClose={handleClose}
			id="edit-folder-blade"
			isBladeInvalid={!!formErrors.name || !!formErrors.description}
		>
			<FormControl
				label={tText('modules/account/components/edit-folder-blade/edit-folder-blade___naam')}
				errors={[
					<div className="u-flex" key={`form-error--name`}>
						<RedFormWarning error={formErrors.name} />
						<MaxLengthIndicator maxLength={90} value={name} />
					</div>,
				]}
			>
				<TextInput maxLength={90} value={name} onChange={(e) => setName(e.target.value)} />
			</FormControl>
			<FormControl
				label={tText(
					'modules/account/components/edit-folder-blade/edit-folder-blade___beschrijving'
				)}
				errors={[
					<div className="u-flex" key={`form-error--description`}>
						<RedFormWarning error={formErrors.description} />
						<MaxLengthIndicator maxLength={300} value={description} />
					</div>,
				]}
			>
				<TextArea
					maxLength={300}
					onChange={(e) => setDescription(e.target.value)}
					value={description}
				/>
			</FormControl>
		</Blade>
	);
};

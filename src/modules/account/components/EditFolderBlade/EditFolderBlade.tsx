import { Button, TextArea, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useEffect, useState } from 'react';

import { foldersService } from '@account/services/folders';
import type { Folder } from '@account/types';
import { Blade } from '@shared/components/Blade/Blade';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';

import styles from './EditFolderBlade.module.scss';

interface EditFolderBladeProps {
	isOpen: boolean;
	onClose: () => void;
	currentFolder?: Folder;
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

	useEffect(() => {
		setName(currentFolder?.name || '');
		setDescription(currentFolder?.description || '');
	}, [currentFolder]);

	const submitData = async (
		values: Partial<Pick<Folder, 'name' | 'description'>>,
		id: string
	) => {
		try {
			await foldersService.update(id, values);

			toastService.notify({
				title: tHtml(
					'modules/account/components/edit-folder-blade/edit-folder-blade___success',
					values
				),
				description: tHtml(
					'modules/account/components/edit-folder-blade/edit-folder-blade___deze-map-is-successvol-aangepast'
				),
			});
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
					onClick={() => {
						const newFolder = { ...currentFolder, name, description } as Folder;
						submitData({ name, description }, newFolder.id);
						onSave(newFolder);
						onClose();
					}}
					label={tText(
						'modules/account/components/edit-folder-blade/edit-folder-blade___bewaar'
					)}
				/>

				<Button
					variants={['block', 'text']}
					onClick={onClose}
					label={tText(
						'modules/account/components/edit-folder-blade/edit-folder-blade___sluit'
					)}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h1 {...props} className={clsx(props.className, styles['p-folder-editor__title'])}>
					{tText(
						'modules/account/components/edit-folder-blade/edit-folder-blade___map-aanpassen'
					)}
				</h1>
			)}
			footer={isOpen && renderFooter()}
			onClose={onClose}
			id="edit-folder-blade"
		>
			<div className={styles['p-folder-editor__content']}>
				<dl>
					<>
						<dt className={styles['p-folder-editor__content-label']}>
							{tText(
								'modules/account/components/edit-folder-blade/edit-folder-blade___naam'
							)}
						</dt>
						<dd className={styles['p-folder-editor__content-value']}>
							<TextInput value={name} onChange={(e) => setName(e.target.value)} />
						</dd>
					</>

					<>
						<dt className={styles['p-folder-editor__content-label']}>
							{tText(
								'modules/account/components/edit-folder-blade/edit-folder-blade___beschrijving'
							)}
						</dt>
						<dd className={styles['p-folder-editor__content-value']}>
							<TextArea
								className={styles['c-request-material__reason-input']}
								onChange={(e) => setDescription(e.target.value)}
								value={description}
							/>
						</dd>
					</>
				</dl>
			</div>
		</Blade>
	);
};

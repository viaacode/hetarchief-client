import { Button, Checkbox } from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, isNil } from 'lodash-es';
import { type FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CreateFolderButton } from '@account/components';
import { useGetFolders } from '@account/hooks/get-folders';
import { foldersService } from '@account/services/folders';
import { type Folder } from '@account/types';
import { Blade } from '@shared/components/Blade/Blade';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/ie-objects';

import styles from './AddToFolderBlade.module.scss';
import { type AddToFolderBladeProps } from './AddToFolderBlade.types';

const AddToFolderBlade: FC<AddToFolderBladeProps> = ({
	objectToAdd,
	onSubmit,
	onClose,
	isOpen,
	className,
	...bladeProps
}) => {
	const getFolders = useGetFolders();
	const folders = useSelector(selectFolders);
	const [originalSelectedFolderIds, setOriginalSelectedFolderIds] = useState<string[] | null>(
		null
	);
	const [selectedFolderIds, setSelectedFolderIds] = useState<string[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	/**
	 * Effects
	 */

	useEffect(() => {
		// Only reset the selected folder ids the first time
		if (isNil(selectedFolderIds) && folders && objectToAdd) {
			const tempOriginalSelectedFolderIds = folders
				.filter((folder) =>
					(folder.objects || []).find(
						(obj) =>
							!!objectToAdd && obj.schemaIdentifier === objectToAdd?.schemaIdentifier
					)
				)
				.map((folder) => folder.id);
			setSelectedFolderIds(tempOriginalSelectedFolderIds);
			setOriginalSelectedFolderIds(tempOriginalSelectedFolderIds);
		}
	}, [folders, objectToAdd, selectedFolderIds]);

	/**
	 * Events
	 */

	const onFailedRequest = async () => {
		await getFolders.refetch();
		setIsSubmitting(false);

		toastService.notify({
			title: tHtml(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-ging-iets-mis'
			),
			description: tHtml(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const folderIdsToTitles = (folderIds: string[]) => {
		if (!folders) {
			return '';
		}
		return compact(
			folderIds.map((folderId) => folders.find((folder) => folder.id === folderId)?.name)
		).join(', ');
	};

	const handleSubmit = async () => {
		if (!objectToAdd) {
			return;
		}
		setIsSubmitting(true);
		try {
			const objectAddedToFolderIds = (selectedFolderIds || []).filter(
				(folderId) => !(originalSelectedFolderIds || []).includes(folderId)
			);
			const objectRemovedFromFolderIds = (originalSelectedFolderIds || []).filter(
				(folderId) => !(selectedFolderIds || []).includes(folderId)
			);

			const addedToFolderIds: string[] = [];
			const removedFromFolderIds: string[] = [];

			// Define our promises
			const updatePromises = [
				...objectAddedToFolderIds.map((folderId) =>
					foldersService
						.addToFolder(folderId, objectToAdd.schemaIdentifier)
						.catch(onFailedRequest)
						.then((response) => {
							if (response === undefined) {
								return;
							}

							addedToFolderIds.push(folderId);
						})
				),
				...objectRemovedFromFolderIds.map((folderId) =>
					foldersService
						.removeFromFolder(folderId, objectToAdd.schemaIdentifier)
						.catch(onFailedRequest)
						.then((response) => {
							if (response === undefined) {
								return;
							}

							removedFromFolderIds.push(folderId);
						})
				),
			];

			// Execute calls
			await Promise.all(updatePromises);

			// Show ONE correct toast message
			if (addedToFolderIds.length > 0 && removedFromFolderIds.length > 0) {
				const folderTitles = folderIdsToTitles([
					...addedToFolderIds,
					...removedFromFolderIds,
				]);
				toastService.notify({
					maxLines: 3,
					title: tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___het-item-is-toegevoegd-verwijderd-van-de-geselecteerde-mappen-titel'
					),
					description: tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___het-item-is-toegevoegd-verwijderd-van-de-geselecteerde-mappen-beschrijving',
						{
							folders: folderTitles,
						}
					),
				});
			} else if (addedToFolderIds.length > 0) {
				const folderTitles = folderIdsToTitles(addedToFolderIds);
				if (addedToFolderIds.length === 1) {
					// Add to one folder
					const folderTitle =
						folderTitles ||
						tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___onbekend'
						);
					toastService.notify({
						maxLines: 3,
						title: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-toegevoegd-aan-map-titel'
						),
						description: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-toegevoegd-aan-map-beschrijving',
							{
								item: objectToAdd.title,
								folder: folderTitle,
							}
						),
					});
				} else {
					// Added to multiple folders
					toastService.notify({
						maxLines: 3,
						title: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-toegevoegd-aan-mappen-titel'
						),
						description: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-toegevoegd-aan-mappen-beschrijving',
							{
								folders: folderTitles,
							}
						),
					});
				}
			} else if (removedFromFolderIds.length > 0) {
				const folderTitles = folderIdsToTitles(removedFromFolderIds);
				if (removedFromFolderIds.length === 1) {
					// Removed from one folder
					const folderTitle =
						folderTitles ||
						tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___onbekend'
						);
					toastService.notify({
						maxLines: 3,
						title: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-verwijderd-uit-map-titel'
						),
						description: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-verwijderd-uit-map-beschrijving',
							{
								item: objectToAdd.title,
								folder: folderTitle,
							}
						),
					});
				} else if (removedFromFolderIds.length > 1) {
					// Removed from multiple folder
					toastService.notify({
						maxLines: 3,
						title: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-verwijderd-uit-mappen-titel'
						),
						description: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-verwijderd-uit-mappen-beschrijving',
							{
								folders: folderTitles,
							}
						),
					});
				}
			}

			// Placing this refetch after the toast messages, otherwise you get this error where the toast message disappears instantly:
			// https://meemoo.atlassian.net/browse/ARC-2048
			await getFolders.refetch();

			onSubmit?.(selectedFolderIds || []);
			resetForm();
			onClose?.();
		} catch (err) {
			toastService.notify({
				maxLines: 3,
				title: tHtml(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___mislukt'
				),
				description: tHtml(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___het-aanpassen-van-de-mappen-is-mislukt'
				),
			});
		}
		setIsSubmitting(false);
	};

	const onCheckboxClick = (changedFolderId: string) => {
		if ((selectedFolderIds || []).includes(changedFolderId)) {
			setSelectedFolderIds(
				(selectedFolderIds || []).filter((folderId) => folderId !== changedFolderId)
			);
		} else {
			setSelectedFolderIds([...(selectedFolderIds || []), changedFolderId]);
		}
	};

	const afterCreateFolderSubmit = async (folder: Folder) => {
		setSelectedFolderIds([...(selectedFolderIds || []), folder.id]);
		await getFolders.refetch();
	};

	const resetForm = () => {
		setOriginalSelectedFolderIds(null);
		setSelectedFolderIds(null);
		setIsSubmitting(false);
	};

	/**
	 * Render
	 */

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit}
					disabled={isSubmitting}
				/>

				<Button
					label={tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={onClose}
				/>
			</div>
		);
	};

	const renderFolderCheckboxes = () => {
		if (!folders) {
			return null;
		}
		return folders.map((folder) => {
			const others = (folder?.objects || []).filter(
				(object) => object.schemaIdentifier !== objectToAdd?.schemaIdentifier
			);

			const isFolderSelected = (selectedFolderIds || []).includes(folder.id);
			const count = others.length + (isFolderSelected ? 1 : 0);

			return (
				<li
					key={`item--${folder.id}`}
					className={styles['c-add-to-folder-blade__list-item']}
					onClick={() => onCheckboxClick(folder.id)}
					tabIndex={0}
					role="button"
				>
					<Checkbox
						value={`add-to--${folder.id}`}
						className={styles['c-add-to-folder-blade__list-item__checkbox']}
						checked={isFolderSelected}
						checkIcon={<Icon name={IconNamesLight.Check} />}
						onClick={(e) => e.stopPropagation()}
						variants={['no-label']}
					/>

					<span className={styles['c-add-to-folder-blade__list-item__label']}>
						{folder?.name}
					</span>

					<span className={styles['c-add-to-folder-blade__list-item__count']}>
						{count === 1
							? tHtml(
									'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___1-item'
							  )
							: tHtml(
									'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___count-items',
									{ count }
							  )}
					</span>
				</li>
			);
		});
	};

	return (
		<Blade
			{...bladeProps}
			isOpen={isOpen}
			onClose={onClose}
			className={clsx(className, styles['c-add-to-folder-blade'])}
			footer={isOpen && renderFooter()}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2 {...props}>
					{tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe-aan-map'
					)}
				</h2>
			)}
		>
			<div className="u-px-32">
				{tHtml(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-map-waaraan-je-strong-title-strong-wil-toevoegen',
					{ title: objectToAdd?.title || '' }
				)}
			</div>

			{isOpen && (
				<div className="u-px-32 u-bg-platinum u-mt-32">
					<ul className={clsx(styles['c-add-to-folder-blade__list'])}>
						{renderFolderCheckboxes()}

						<li className={styles['c-add-to-folder-blade__list-button']}>
							<CreateFolderButton afterSubmit={afterCreateFolderSubmit} />
						</li>
					</ul>
				</div>
			)}
		</Blade>
	);
};

export default AddToFolderBlade;

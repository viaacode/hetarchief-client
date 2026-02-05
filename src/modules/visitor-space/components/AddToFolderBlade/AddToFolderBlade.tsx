import { CreateFolderButton } from '@account/components';
import { useGetFolders } from '@account/hooks/get-folders';
import { FoldersService } from '@account/services/folders';
import type { Folder } from '@account/types';
import { Checkbox } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import { compact, isNil } from 'lodash-es';
import { type FC, useEffect, useState } from 'react';

import styles from './AddToFolderBlade.module.scss';
import type { AddToFolderBladeProps } from './AddToFolderBlade.types';

const AddToFolderBlade: FC<AddToFolderBladeProps> = ({
	objectToAdd,
	onSubmit,
	onClose,
	isOpen,
	className,
	...bladeProps
}) => {
	const { data: folders, refetch: refetchFolders } = useGetFolders();
	const [originalSelectedFolderIds, setOriginalSelectedFolderIds] = useState<string[] | null>(null);
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
						(obj) => !!objectToAdd && obj.schemaIdentifier === objectToAdd?.schemaIdentifier
					)
				)
				.map((folder) => folder.id);
			setSelectedFolderIds(tempOriginalSelectedFolderIds);
			setOriginalSelectedFolderIds([...tempOriginalSelectedFolderIds]);
		}
	}, [folders, objectToAdd, selectedFolderIds]);

	/**
	 * Events
	 */

	const onFailedRequest = async () => {
		await refetchFolders();
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

	const triggerNotifications = (addedToFolderIds: string[], removedFromFolderIds: string[]) => {
		if (!objectToAdd) {
			return;
		}
		if (addedToFolderIds.length > 0 && removedFromFolderIds.length > 0) {
			const folderTitles = folderIdsToTitles([...addedToFolderIds, ...removedFromFolderIds]);
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
	};

	const addToFolder = async (
		folderId: string,
		objectSchemaIdentifier: string
	): Promise<{ removed?: string; added?: string }> => {
		try {
			const response = await FoldersService.addToFolder(folderId, objectSchemaIdentifier);
			if (!response) {
				return {};
			}

			return { added: folderId };
		} catch (err) {
			console.error('Failed to add object to folder', err, { folderId, objectSchemaIdentifier });
			await onFailedRequest();
			return {};
		}
	};

	const removeFromFolder = async (
		folderId: string,
		objectSchemaIdentifier: string
	): Promise<{ removed?: string; added?: string }> => {
		try {
			const response = await FoldersService.removeFromFolder(folderId, objectSchemaIdentifier);
			if (!response) {
				return {};
			}

			return { removed: folderId };
		} catch (err) {
			console.error('Failed to remove object from folder', err, {
				folderId,
				objectSchemaIdentifier,
			});
			await onFailedRequest();
			return {};
		}
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
				...objectAddedToFolderIds.map((folderId) => {
					return addToFolder(folderId, objectToAdd.schemaIdentifier);
				}),
				...objectRemovedFromFolderIds.map((folderId) =>
					removeFromFolder(folderId, objectToAdd.schemaIdentifier)
				),
			];

			// Execute calls
			const responses = await Promise.all(updatePromises);
			for (const response of responses) {
				if (response?.added) {
					addedToFolderIds.push(response.added);
				} else if (response?.removed) {
					removedFromFolderIds.push(response.removed);
				}
			}

			// Show ONE correct toast message
			triggerNotifications(addedToFolderIds, removedFromFolderIds);

			// Placing this refetch after the toast messages, otherwise you get this error where the toast message disappears instantly:
			// https://meemoo.atlassian.net/browse/ARC-2048
			await refetchFolders();

			onSubmit?.(selectedFolderIds || []);
			resetForm();
			onClose?.();
		} catch (_err) {
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
		await refetchFolders();
	};

	const resetForm = () => {
		setOriginalSelectedFolderIds(null);
		setSelectedFolderIds(null);
		setIsSubmitting(false);
	};

	/**
	 * Render
	 */

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
				),
				type: 'primary',
				onClick: handleSubmit,
				disabled: isSubmitting,
			},
			{
				label: tText(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___annuleer'
				),
				type: 'secondary',
				onClick: onClose,
			},
		];
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
					onKeyUp={(evt) => {
						if (evt.key === 'Enter') {
							onCheckboxClick(folder.id);
						}
					}}
				>
					<Checkbox
						value={`add-to--${folder.id}`}
						className={styles['c-add-to-folder-blade__list-item__checkbox']}
						checked={isFolderSelected}
						checkIcon={<Icon name={IconNamesLight.Check} />}
						onClick={(e) => e.stopPropagation()}
						variants={['no-label']}
						aria-label={tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-folder-toe-aan-map',
							{
								folder: folder?.name,
							}
						)}
					/>

					<span className={styles['c-add-to-folder-blade__list-item__label']}>{folder?.name}</span>

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
			footerButtons={getFooterButtons()}
			title={tText(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe-aan-map'
			)}
		>
			{tHtml(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-map-waaraan-je-strong-title-strong-wil-toevoegen',
				{
					title: objectToAdd?.title || '',
				}
			)}

			<ul className={clsx(styles['c-add-to-folder-blade__list'])}>
				{renderFolderCheckboxes()}

				<li className={styles['c-add-to-folder-blade__list-button']}>
					<CreateFolderButton afterSubmit={afterCreateFolderSubmit} />
				</li>
			</ul>
		</Blade>
	);
};

export default AddToFolderBlade;

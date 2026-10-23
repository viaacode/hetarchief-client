import { CreateFolderButton } from '@account/components';
import { FolderSortOption, Permission } from '@account/const';
import { useGetFolders } from '@account/hooks/get-folders';
import { FoldersService } from '@account/services/folders';
import type { Folder } from '@account/types';
import { getOrganisationFolders, getPersonalFolders, sortFolders } from '@account/utils/folders';
import { Checkbox } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import { compact } from 'es-toolkit/compat';
import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';

import styles from './AddToFolderBlade.module.scss';
import type { AddToFolderBladeProps, FolderChanges } from './AddToFolderBlade.types';

enum FolderSection {
	ORGANISATION = 'ORGANISATION',
	PERSONAL = 'PERSONAL',
}

// How many of the selected objects a folder contains
enum FolderContents {
	NONE = 'NONE',
	SOME = 'SOME',
	ALL = 'ALL',
}

// Change the user made to a folder in the blade, folders without a change keep their contents
enum FolderChange {
	ADD = 'ADD',
	REMOVE = 'REMOVE',
}

enum FolderCheckboxState {
	CHECKED = 'CHECKED',
	INDETERMINATE = 'INDETERMINATE',
	UNCHECKED = 'UNCHECKED',
}

const AddToFolderBlade: FC<AddToFolderBladeProps> = ({
	objectsToAdd,
	onSubmit,
	onClose,
	onSaveMultipleObjects,
	isOpen,
	className,
	...bladeProps
}) => {
	const { data: folders, isError: isFoldersError, refetch: refetchFolders } = useGetFolders();
	const canManageOrganisationFolders = useHasAllPermission(Permission.MANAGE_ORGANISATION_FOLDERS);
	const [folderChanges, setFolderChanges] = useState<Record<string, FolderChange>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [collapsedSections, setCollapsedSections] = useState<FolderSection[]>([]);

	// A folder that contains all selected objects is checked, one that contains some of them is indeterminate
	// Clicking cycles through the states, so the objects can be added to or removed from every folder
	const objectToAdd = objectsToAdd.length === 1 ? objectsToAdd[0] : undefined;
	const isMultipleObjects = objectsToAdd.length > 1;
	const objectSchemaIdentifiers = useMemo(
		() => objectsToAdd.map((object) => object.schemaIdentifier),
		[objectsToAdd]
	);

	// CP admins see their organisation folders and personal folders in separate sections
	// Within a section the newest folder is shown first, but favorites are always on top
	const personalFolders = useMemo(
		() => sortFolders(getPersonalFolders(folders), FolderSortOption.NEWEST_FIRST),
		[folders]
	);
	const organisationFolders = useMemo(
		() => sortFolders(getOrganisationFolders(folders), FolderSortOption.NEWEST_FIRST),
		[folders]
	);
	const showFolderSections = canManageOrganisationFolders;

	const getFolderContents = (folder: Folder): FolderContents => {
		const selectedObjectsInFolder = (folder.objects || []).filter((object) =>
			objectSchemaIdentifiers.includes(object.schemaIdentifier)
		).length;
		if (selectedObjectsInFolder === 0) {
			return FolderContents.NONE;
		}
		return selectedObjectsInFolder >= objectSchemaIdentifiers.length
			? FolderContents.ALL
			: FolderContents.SOME;
	};

	const getFolderCheckboxState = (folder: Folder): FolderCheckboxState => {
		const change = folderChanges[folder.id];
		if (change === FolderChange.ADD) {
			return FolderCheckboxState.CHECKED;
		}
		if (change === FolderChange.REMOVE) {
			return FolderCheckboxState.UNCHECKED;
		}
		return {
			[FolderContents.NONE]: FolderCheckboxState.UNCHECKED,
			[FolderContents.SOME]: FolderCheckboxState.INDETERMINATE,
			[FolderContents.ALL]: FolderCheckboxState.CHECKED,
		}[getFolderContents(folder)];
	};

	/**
	 * The folders the objects need to be added to or removed from
	 * Changes that would not change the folder contents are left out, eg: adding objects that are already in the folder
	 */
	const getChanges = (): FolderChanges => {
		const changes: FolderChanges = { addToFolderIds: [], removeFromFolderIds: [] };
		for (const folder of folders || []) {
			const change = folderChanges[folder.id];
			const contents = getFolderContents(folder);
			if (change === FolderChange.ADD && contents !== FolderContents.ALL) {
				changes.addToFolderIds.push(folder.id);
			} else if (change === FolderChange.REMOVE && contents !== FolderContents.NONE) {
				changes.removeFromFolderIds.push(folder.id);
			}
		}
		return changes;
	};

	/**
	 * Effects
	 */

	// Start fresh every time the blade is opened, also when it was closed without saving
	// biome-ignore lint/correctness/useExhaustiveDependencies: only react to the blade opening or closing
	useEffect(() => {
		if (!isOpen) {
			resetForm();
		}
	}, [isOpen]);

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

	const handleSubmitMultipleObjects = async () => {
		const changes = getChanges();
		if (
			(!changes.addToFolderIds.length && !changes.removeFromFolderIds.length) ||
			!onSaveMultipleObjects
		) {
			return;
		}
		setIsSubmitting(true);
		// The caller shows the result and keeps the selection when saving fails, so the blade can always close
		onClose?.();
		await onSaveMultipleObjects(changes);
		setIsSubmitting(false);
	};

	const handleSubmit = async () => {
		if (isMultipleObjects) {
			await handleSubmitMultipleObjects();
			return;
		}
		if (!objectToAdd) {
			return;
		}
		setIsSubmitting(true);
		try {
			const {
				addToFolderIds: objectAddedToFolderIds,
				removeFromFolderIds: objectRemovedFromFolderIds,
			} = getChanges();
			// The folders that contain the object after saving
			const checkedFolderIds = (folders || [])
				.filter((folder) => getFolderCheckboxState(folder) === FolderCheckboxState.CHECKED)
				.map((folder) => folder.id);

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

			onSubmit?.(checkedFolderIds);
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

	/**
	 * Cycles through the states the folder can have:
	 * - folder without the objects: unchecked <-> checked
	 * - folder with all objects: checked <-> unchecked
	 * - folder with some of the objects: indeterminate -> checked -> unchecked -> indeterminate
	 */
	const onCheckboxClick = (folder: Folder) => {
		const contents = getFolderContents(folder);
		let newChange: FolderChange | undefined;
		switch (getFolderCheckboxState(folder)) {
			case FolderCheckboxState.INDETERMINATE:
				newChange = FolderChange.ADD;
				break;
			case FolderCheckboxState.CHECKED:
				newChange = contents === FolderContents.NONE ? undefined : FolderChange.REMOVE;
				break;
			case FolderCheckboxState.UNCHECKED:
				newChange = contents === FolderContents.NONE ? FolderChange.ADD : undefined;
				break;
		}
		setFolderChanges((changes) => {
			const { [folder.id]: _oldChange, ...otherChanges } = changes;
			return newChange ? { ...otherChanges, [folder.id]: newChange } : otherChanges;
		});
	};

	const afterCreateFolderSubmit = async (folder: Folder) => {
		setFolderChanges((changes) => ({ ...changes, [folder.id]: FolderChange.ADD }));
		// Make sure the new folder is visible
		setCollapsedSections([]);
		await refetchFolders();
	};

	const toggleSection = (section: FolderSection) => {
		setCollapsedSections((sections) =>
			sections.includes(section) ? sections.filter((s) => s !== section) : [...sections, section]
		);
	};

	const resetForm = () => {
		setFolderChanges({});
		setIsSubmitting(false);
	};

	/**
	 * Render
	 */

	const getFooterButtons = (): BladeFooterButtonProps => {
		const { addToFolderIds, removeFromFolderIds } = getChanges();
		// "Add" would be misleading when objects are removed from folders
		const hasRemovals = removeFromFolderIds.length > 0;
		return [
			{
				label: hasRemovals
					? tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___opslaan'
						)
					: tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
						),
				mobileLabel: hasRemovals
					? tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___opslaan-mobiel'
						)
					: tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe-mobiel'
						),
				type: 'primary',
				onClick: handleSubmit,
				disabled:
					isSubmitting ||
					!objectsToAdd.length ||
					(isMultipleObjects && !addToFolderIds.length && !hasRemovals),
			},
			{
				label: tText(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___annuleer'
				),
				mobileLabel: tText(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___annuleer-mobiel'
				),
				type: 'secondary',
				onClick: onClose,
			},
		];
	};

	/**
	 * Explains the indeterminate state and how many objects will be added or removed
	 * Only shown when multiple objects are selected and the folder already contains some of them
	 * All hints the folder can show are rendered on top of each other and only the active one is visible,
	 * so the tallest hint determines the height and the list does not jump when the checkbox changes
	 */
	const renderFolderHints = (
		checkboxState: FolderCheckboxState,
		contents: FolderContents,
		selectedObjectsInFolder: number
	): ReactNode => {
		if (!isMultipleObjects || contents === FolderContents.NONE) {
			return null;
		}
		const addedCount = objectSchemaIdentifiers.length - selectedObjectsInFolder;
		const hints: { state: FolderCheckboxState; className?: string; text: ReactNode }[] = [];
		if (contents === FolderContents.SOME) {
			hints.push({
				state: FolderCheckboxState.INDETERMINATE,
				text: tHtml(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___count-van-de-total-objecten-zitten-al-in-deze-map',
					{ count: selectedObjectsInFolder, total: objectSchemaIdentifiers.length }
				),
			});
		}
		if (contents !== FolderContents.ALL) {
			hints.push({
				state: FolderCheckboxState.CHECKED,
				text:
					addedCount === 1
						? tHtml(
								'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___1-object-wordt-aan-deze-map-toegevoegd'
							)
						: tHtml(
								'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___count-objecten-worden-aan-deze-map-toegevoegd',
								{ count: addedCount }
							),
			});
		}
		hints.push({
			state: FolderCheckboxState.UNCHECKED,
			className: styles['c-add-to-folder-blade__list-item__hint--remove'],
			text:
				selectedObjectsInFolder === 1
					? tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___1-object-wordt-uit-deze-map-verwijderd'
						)
					: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___count-objecten-worden-uit-deze-map-verwijderd',
							{ count: selectedObjectsInFolder }
						),
		});

		return (
			<span className={styles['c-add-to-folder-blade__list-item__hints']}>
				{hints.map((hint) => {
					const isActive = hint.state === checkboxState;
					return (
						<span
							key={hint.state}
							className={clsx(
								styles['c-add-to-folder-blade__list-item__hint'],
								hint.className,
								!isActive && styles['c-add-to-folder-blade__list-item__hint--hidden']
							)}
							aria-hidden={!isActive}
						>
							{hint.text}
						</span>
					);
				})}
			</span>
		);
	};

	const renderFolderCheckbox = (folder: Folder) => {
		const checkboxState = getFolderCheckboxState(folder);
		const contents = getFolderContents(folder);
		// Count the objects in the folder as if the changes were already saved
		const objectsInFolder = (folder?.objects || []).map((object) => object.schemaIdentifier);
		const others = objectsInFolder.filter(
			(schemaIdentifier) => !objectSchemaIdentifiers.includes(schemaIdentifier)
		);
		const selectedObjectsInFolder = objectsInFolder.length - others.length;
		const count =
			others.length +
			{
				[FolderCheckboxState.CHECKED]: objectSchemaIdentifiers.length,
				[FolderCheckboxState.INDETERMINATE]: selectedObjectsInFolder,
				[FolderCheckboxState.UNCHECKED]: 0,
			}[checkboxState];

		return (
			// biome-ignore lint/a11y/useKeyWithClickEvents: the checkbox in the list item handles the keyboard interaction
			<li
				key={`item--${folder.id}`}
				className={styles['c-add-to-folder-blade__list-item']}
				onClick={(evt) => {
					// Clicks on the checkbox itself are handled by its change event
					if (!(evt.target as HTMLElement).closest('label')) {
						onCheckboxClick(folder);
					}
				}}
			>
				<Checkbox
					value={`add-to--${folder.id}`}
					className={styles['c-add-to-folder-blade__list-item__checkbox']}
					checked={checkboxState === FolderCheckboxState.CHECKED}
					indeterminate={checkboxState === FolderCheckboxState.INDETERMINATE}
					checkIcon={<Icon name={IconNamesLight.Check} aria-hidden />}
					indeterminateIcon={<Icon name={IconNamesLight.Minus} aria-hidden />}
					onChange={() => onCheckboxClick(folder)}
					variants={['no-label']}
					aria-label={tText(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-folder-toe-aan-map',
						{
							folder: folder?.name,
						}
					)}
				/>

				<span className={styles['c-add-to-folder-blade__list-item__label']}>
					{folder?.name}
					{renderFolderHints(checkboxState, contents, selectedObjectsInFolder)}
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
	};

	const renderCreateFolderButton = () => (
		<li className={styles['c-add-to-folder-blade__list-button']}>
			<CreateFolderButton
				afterSubmit={afterCreateFolderSubmit}
				showOrganisationOption={canManageOrganisationFolders}
				keepIconWhenOpen
			/>
		</li>
	);

	const renderSection = (section: FolderSection, title: string, sectionFolders: Folder[]) => {
		const isExpanded = !collapsedSections.includes(section);
		const listId = `add-to-folder-blade__section--${section}`;

		return (
			<section className={styles['c-add-to-folder-blade__section']}>
				<button
					type="button"
					className={styles['c-add-to-folder-blade__section-toggle']}
					aria-expanded={isExpanded}
					aria-controls={listId}
					onClick={() => toggleSection(section)}
				>
					<span>{title}</span>
					<Icon name={isExpanded ? IconNamesLight.AngleUp : IconNamesLight.AngleDown} aria-hidden />
				</button>
				{isExpanded && (
					<ul id={listId} className={clsx(styles['c-add-to-folder-blade__list'])}>
						{sectionFolders.length ? (
							sectionFolders.map(renderFolderCheckbox)
						) : (
							<li className={styles['c-add-to-folder-blade__list-empty']}>
								{section === FolderSection.ORGANISATION
									? tText(
											'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-zijn-nog-geen-organisatiemappen'
										)
									: tText(
											'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-zijn-nog-geen-persoonlijke-mappen'
										)}
							</li>
						)}
					</ul>
				)}
			</section>
		);
	};

	const renderFolders = (): ReactNode => {
		if (isFoldersError) {
			return (
				<p className={styles['c-add-to-folder-blade__error']}>
					{tText(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___het-ophalen-van-de-mappenlijst-is-mislukt-probeer-later-opnieuw'
					)}
				</p>
			);
		}
		if (!folders) {
			return null;
		}

		if (showFolderSections) {
			return (
				<>
					<ul className={clsx(styles['c-add-to-folder-blade__list'])}>
						{renderCreateFolderButton()}
					</ul>
					{renderSection(
						FolderSection.ORGANISATION,
						tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___organisatiemappen'
						),
						organisationFolders
					)}
					{renderSection(
						FolderSection.PERSONAL,
						tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___persoonlijke-mappen'
						),
						personalFolders
					)}
				</>
			);
		}

		return (
			<ul className={clsx(styles['c-add-to-folder-blade__list'])}>
				{renderCreateFolderButton()}
				{personalFolders.map(renderFolderCheckbox)}
			</ul>
		);
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
			stickySubtitle={
				isMultipleObjects
					? tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-mappen-waarin-je-deze-count-objecten-wil-bewaren',
							{
								count: objectsToAdd.length,
							}
						)
					: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-map-waaraan-je-strong-title-strong-wil-toevoegen',
							{
								title: objectToAdd?.title || '',
							}
						)
			}
		>
			{renderFolders()}
		</Blade>
	);
};

export default AddToFolderBlade;

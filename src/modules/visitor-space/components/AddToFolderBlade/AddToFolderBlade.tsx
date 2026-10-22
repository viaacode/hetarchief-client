import { CreateFolderButton } from '@account/components';
import { FolderSortOption, Permission } from '@account/const';
import { useGetFolders } from '@account/hooks/get-folders';
import { FoldersService } from '@account/services/folders';
import type { Folder } from '@account/types';
import { getOrganisationFolders, getPersonalFolders, sortFolders } from '@account/utils/folders';
import { Button, Checkbox, TagList } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import { compact, isNil } from 'es-toolkit/compat';
import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';

import styles from './AddToFolderBlade.module.scss';
import type { AddToFolderBladeProps } from './AddToFolderBlade.types';

// Number of selected objects that are shown as a tag, the others are summarized as "+ n more"
const MAX_VISIBLE_OBJECT_TAGS = 4;

enum FolderSection {
	ORGANISATION = 'ORGANISATION',
	PERSONAL = 'PERSONAL',
}

const AddToFolderBlade: FC<AddToFolderBladeProps> = ({
	objectsToAdd,
	onSubmit,
	onClose,
	onRemoveObject,
	onAddMultipleObjects,
	isOpen,
	className,
	...bladeProps
}) => {
	const { data: folders, isError: isFoldersError, refetch: refetchFolders } = useGetFolders();
	const canManageOrganisationFolders = useHasAllPermission(Permission.MANAGE_ORGANISATION_FOLDERS);
	const [originalSelectedFolderIds, setOriginalSelectedFolderIds] = useState<string[] | null>(null);
	const [selectedFolderIds, setSelectedFolderIds] = useState<string[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [collapsedSections, setCollapsedSections] = useState<FolderSection[]>([]);
	const [showAllObjectTags, setShowAllObjectTags] = useState(false);

	// With one object, the folders can be checked and unchecked to add or remove the object
	// With multiple objects, the objects can only be added
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

	/**
	 * Effects
	 */

	useEffect(() => {
		// Only reset the selected folder ids the first time
		if (isNil(selectedFolderIds) && folders && objectsToAdd.length) {
			// Multiple objects can only be added, so no folders are preselected
			const tempOriginalSelectedFolderIds = objectToAdd
				? folders
						.filter((folder) =>
							(folder.objects || []).find(
								(obj) => obj.schemaIdentifier === objectToAdd.schemaIdentifier
							)
						)
						.map((folder) => folder.id)
				: [];
			setSelectedFolderIds(tempOriginalSelectedFolderIds);
			setOriginalSelectedFolderIds([...tempOriginalSelectedFolderIds]);
		}
	}, [folders, objectToAdd, objectsToAdd.length, selectedFolderIds]);

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
		if (!selectedFolderIds?.length || !onAddMultipleObjects) {
			return;
		}
		setIsSubmitting(true);
		const folderIds = [...selectedFolderIds];
		// The caller shows the result and keeps the selection when saving fails, so the blade can always close
		onClose?.();
		await onAddMultipleObjects(folderIds);
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
		setOriginalSelectedFolderIds(null);
		setSelectedFolderIds(null);
		setIsSubmitting(false);
		setShowAllObjectTags(false);
	};

	/**
	 * Render
	 */

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
				),
				mobileLabel: tText(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe-mobiel'
				),
				type: 'primary',
				onClick: handleSubmit,
				disabled:
					isSubmitting || !objectsToAdd.length || (isMultipleObjects && !selectedFolderIds?.length),
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

	const renderFolderCheckbox = (folder: Folder) => {
		const isFolderSelected = (selectedFolderIds || []).includes(folder.id);
		// Count the objects in the folder as if the selection was already saved
		const objectsInFolder = (folder?.objects || []).map((object) => object.schemaIdentifier);
		const others = objectsInFolder.filter(
			(schemaIdentifier) => !objectSchemaIdentifiers.includes(schemaIdentifier)
		);
		const selectedObjectsInFolder = objectsInFolder.length - others.length;
		const count =
			others.length +
			(isFolderSelected
				? objectSchemaIdentifiers.length
				: isMultipleObjects
					? selectedObjectsInFolder
					: 0);

		return (
			// biome-ignore lint/a11y/useKeyWithClickEvents: the checkbox in the list item handles the keyboard interaction
			<li
				key={`item--${folder.id}`}
				className={styles['c-add-to-folder-blade__list-item']}
				onClick={(evt) => {
					// Clicks on the checkbox itself are handled by its change event
					if (!(evt.target as HTMLElement).closest('label')) {
						onCheckboxClick(folder.id);
					}
				}}
			>
				<Checkbox
					value={`add-to--${folder.id}`}
					className={styles['c-add-to-folder-blade__list-item__checkbox']}
					checked={isFolderSelected}
					checkIcon={<Icon name={IconNamesLight.Check} aria-hidden />}
					onChange={() => onCheckboxClick(folder.id)}
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
	};

	const renderCreateFolderButton = () => (
		<li className={styles['c-add-to-folder-blade__list-button']}>
			<CreateFolderButton
				afterSubmit={afterCreateFolderSubmit}
				showOrganisationOption={canManageOrganisationFolders}
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

	const renderSelectedObjects = (): ReactNode => {
		if (!isMultipleObjects) {
			return null;
		}
		const visibleObjects = showAllObjectTags
			? objectsToAdd
			: objectsToAdd.slice(0, MAX_VISIBLE_OBJECT_TAGS);
		const hiddenCount = objectsToAdd.length - visibleObjects.length;

		return (
			<div className={styles['c-add-to-folder-blade__selected-objects']}>
				<TagList
					tags={visibleObjects.map((object) => ({
						id: object.schemaIdentifier,
						label: (
							<span
								className={styles['c-add-to-folder-blade__selected-objects__label']}
								title={object.title}
							>
								{object.title || object.schemaIdentifier}
							</span>
						),
					}))}
					closeIcon={
						<Icon
							name={IconNamesLight.Times}
							aria-label={tText(
								'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___verwijder-uit-selectie'
							)}
						/>
					}
					onTagClosed={(schemaIdentifier) => onRemoveObject?.(String(schemaIdentifier))}
					variants={onRemoveObject ? ['closable', 'silver'] : ['silver']}
				/>
				{hiddenCount > 0 && (
					<Button
						className={styles['c-add-to-folder-blade__selected-objects__more']}
						variants={['text', 'sm']}
						label={tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___count-meer',
							{ count: hiddenCount }
						)}
						ariaLabel={tText(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___toon-alle-count-geselecteerde-objecten',
							{
								count: objectsToAdd.length,
							}
						)}
						onClick={() => setShowAllObjectTags(true)}
					/>
				)}
			</div>
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
				isMultipleObjects ? (
					<>
						{tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-map-pen-waarin-je-deze-count-objecten-wil-bewaren',
							{
								count: objectsToAdd.length,
							}
						)}
						{renderSelectedObjects()}
					</>
				) : (
					tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-map-waaraan-je-strong-title-strong-wil-toevoegen',
						{
							title: objectToAdd?.title || '',
						}
					)
				)
			}
		>
			{renderFolders()}
		</Blade>
	);
};

export default AddToFolderBlade;

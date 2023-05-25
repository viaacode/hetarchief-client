import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { CreateFolderButton } from '@account/components';
import { useGetFolders } from '@account/hooks/get-folders';
import { foldersService } from '@account/services/folders';
import { Folder } from '@account/types';
import { Blade, Icon, IconNamesLight } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/ie-objects';

import { ADD_TO_FOLDER_FORM_SCHEMA } from './AddToFolderBlade.const';
import styles from './AddToFolderBlade.module.scss';
import {
	AddToFolderBladeProps,
	AddToFolderFormState,
	AddToFolderFormStatePair,
	AddToFolderSelected,
} from './AddToFolderBlade.types';

const AddToFolderBlade: FC<AddToFolderBladeProps> = (props) => {
	const { tHtml } = useTranslation();
	const { onSubmit, selected } = props;
	const [pairs, setPairs] = useState<AddToFolderFormStatePair[]>([]);
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AddToFolderFormState>({
		resolver: yupResolver(ADD_TO_FOLDER_FORM_SCHEMA()),
		defaultValues: useMemo(() => ({ pairs }), [pairs]),
	});

	const getFolders = useGetFolders();
	const collections = useSelector(selectFolders);

	/**
	 * Methods
	 */

	const mapToPairs = (collections: Folder[], selected: AddToFolderSelected) => {
		return collections.map(({ id, objects }) => {
			return {
				folder: id,
				ie: selected.schemaIdentifier,
				checked: !!(objects || []).find(
					(obj) => obj.schemaIdentifier === selected.schemaIdentifier
				),
			};
		});
	};

	const getFolder = (id: string) =>
		(collections?.items || []).find((collection) => collection.id === id);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (selected?.schemaIdentifier && collections) {
			setPairs(mapToPairs(collections?.items || [], selected));
		}
	}, [setValue, reset, collections, selected]);

	useEffect(() => {
		setValue('pairs', pairs);
	}, [setValue, pairs]);

	useEffect(() => {
		props.isOpen && reset();
	}, [props.isOpen, reset]);

	/**
	 * Events
	 */

	const onFailedRequest = async () => {
		await getFolders.refetch();

		toastService.notify({
			title: tHtml(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-ging-iets-mis'
			),
			description: tHtml(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const onFormSubmit = async (values: AddToFolderFormState) => {
		if (selected) {
			const original = mapToPairs(collections?.items || [], selected);
			const dirty = values.pairs.filter((current) => {
				return (
					current.checked !== original.find((o) => o.folder === current.folder)?.checked
				);
			});

			const addedToFolders: Array<{
				item: AddToFolderSelected;
				folder: string;
			}> = [];
			const removedFromFolders: Array<{
				item: AddToFolderSelected;
				folder: string;
			}> = [];

			// Define our promises
			const addOrRemoveItemFromFolderPromises = dirty.map((pair) => {
				const folder = getFolder(pair.folder)?.name || pair.folder;
				if (pair.checked) {
					return foldersService
						.addToCollection(pair.folder, selected.schemaIdentifier)
						.catch(onFailedRequest)
						.then((response) => {
							if (response === undefined) {
								return;
							}

							addedToFolders.push({
								folder,
								item: selected,
							});
						});
				} else {
					return foldersService
						.removeFromFolder(pair.folder, selected.schemaIdentifier)
						.catch(onFailedRequest)
						.then((response) => {
							if (response === undefined) {
								return;
							}

							removedFromFolders.push({
								folder,
								item: selected,
							});
						});
				}
			});

			// Execute calls
			await Promise.all(addOrRemoveItemFromFolderPromises);
			await getFolders.refetch();

			// Show ONE correct toast message
			if (addedToFolders.length > 0 && removedFromFolders.length > 0) {
				const folders = [...addedToFolders, ...removedFromFolders]
					.map((obj) => obj.folder)
					.join(', ');
				toastService.notify({
					maxLines: 3,
					title: tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___het-item-is-toegevoegd-verwijderd-van-de-geselecteerde-mappen-titel'
					),
					description: tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___het-item-is-toegevoegd-verwijderd-van-de-geselecteerde-mappen-beschrijving',
						{
							folders,
						}
					),
				});
			} else if (addedToFolders.length > 0) {
				const folders = addedToFolders.map((obj) => obj.folder).join(', ');
				if (addedToFolders.length === 1) {
					// Add to one folder
					const item = addedToFolders[0].item.title;
					const folder =
						addedToFolders[0].folder ||
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
								item,
								folder,
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
								folders,
							}
						),
					});
				}
			} else if (removedFromFolders.length > 0) {
				const folders = removedFromFolders.map((obj) => obj.folder).join(', ');
				if (removedFromFolders.length === 1) {
					// Removed from one folder
					const item = removedFromFolders[0].item.title;
					const folder =
						removedFromFolders[0].folder ||
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
								item,
								folder,
							}
						),
					});
				} else if (removedFromFolders.length > 1) {
					// Removed from multiple folder
					toastService.notify({
						maxLines: 3,
						title: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-verwijderd-uit-mappen-titel'
						),
						description: tHtml(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-verwijderd-uit-mappen-beschrijving',
							{
								folders,
							}
						),
					});
				}
			}

			onSubmit?.(values);
			reset();
		}
	};

	const onCheckboxClick = (pair: AddToFolderFormStatePair) => {
		// immutably update state, form state updated by effect
		setPairs(
			pairs.map((item) => {
				if (item.folder === pair.folder) {
					item.checked = !pair.checked;
				}

				return item;
			})
		);
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
					onClick={handleSubmit(onFormSubmit, () => console.error(errors))}
					disabled={isSubmitting}
				/>

				<Button
					label={tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={props.onClose}
				/>
			</div>
		);
	};

	const renderPairFields = (data: {
		field: ControllerRenderProps<AddToFolderFormState, 'pairs'>;
	}) => {
		const { field } = data;

		return field.value.map((pair) => {
			const collection = getFolder(pair.folder);
			const others = (collection?.objects || []).filter(
				(object) => object.schemaIdentifier !== pair.ie
			);

			const count = others.length + (pair.checked ? 1 : 0);

			return (
				<li
					key={`item--${pair.folder}`}
					className={styles['c-add-to-folder-blade__list-item']}
					onClick={() => onCheckboxClick(pair)}
					tabIndex={0}
					role="button"
				>
					<Checkbox
						value={`add-to--${pair.folder}`}
						className={styles['c-add-to-folder-blade__list-item__checkbox']}
						checked={pair.checked}
						checkIcon={<Icon name={IconNamesLight.Check} />}
						onClick={(e) => e.stopPropagation()}
						variants={['no-label']}
					/>

					<span className={styles['c-add-to-folder-blade__list-item__label']}>
						{collection?.name}
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

	const title = selected?.title;

	return (
		<Blade
			{...props}
			className={clsx(props.className, styles['c-add-to-folder-blade'])}
			footer={props.isOpen && renderFooter()}
			renderTitle={() => (
				<h4 className={styles['c-add-to-folder-blade__title']}>
					{tHtml(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe-aan-map'
					)}
				</h4>
			)}
		>
			<div className="u-px-32">
				{tHtml(
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-map-waaraan-je-strong-title-strong-wil-toevoegen',
					{ title }
				)}
			</div>

			{props.isOpen && (
				<div className="u-px-32 u-bg-platinum">
					<ul className={clsx(styles['c-add-to-folder-blade__list'])}>
						<Controller
							name="pairs"
							control={control}
							render={(data) => (
								<>
									{renderPairFields(data)}

									<li className={styles['c-add-to-folder-blade__list-button']}>
										<CreateFolderButton afterSubmit={getFolders.refetch} />
									</li>
								</>
							)}
						/>
					</ul>
				</div>
			)}
		</Blade>
	);
};

export default AddToFolderBlade;

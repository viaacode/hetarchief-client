import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { CreateCollectionButton } from '@account/components';
import { useGetCollections } from '@account/hooks/get-collections';
import { collectionsService } from '@account/services/collections';
import { Folder } from '@account/types';
import { Blade, Icon } from '@shared/components';
import Html from '@shared/components/Html/Html';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/media';

import { ADD_TO_FOLDER_FORM_SCHEMA } from './AddToFolderBlade.const';
import styles from './AddToFolderBlade.module.scss';
import {
	AddToFolderBladeProps,
	AddToFolderFormState,
	AddToFolderFormStatePair,
	AddToFolderSelected,
} from './AddToFolderBlade.types';

const AddToFolderBlade: FC<AddToFolderBladeProps> = (props) => {
	const { t } = useTranslation();
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

	const getFolders = useGetCollections();
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

	const onFailedRequest = () => {
		getFolders.refetch();

		toastService.notify({
			title: t(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-ging-iets-mis'
			),
			description: t(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const onFormSubmit = (values: AddToFolderFormState) => {
		if (selected) {
			const original = mapToPairs(collections?.items || [], selected);
			const dirty = values.pairs.filter((current) => {
				return (
					current.checked !== original.find((o) => o.folder === current.folder)?.checked
				);
			});

			const addedToFolders: Array<{
				toastMessage: { maxLines: number; title: string; description: string };
				descriptionVariables: Record<'item' | 'folder', unknown>;
			}> = [];
			const removedFromFolders: Array<{
				toastMessage: { maxLines: number; title: string; description: string };
				descriptionVariables: Record<'item' | 'folder', unknown>;
			}> = [];

			// Define our promises
			const promises = dirty.map((pair) => {
				const folder = getFolder(pair.folder);

				const descriptionVariables: Record<'item' | 'folder', unknown> = {
					item: selected.title,
					folder:
						folder?.name ||
						t(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___onbekend'
						),
				};
				if (pair.checked) {
					return collectionsService
						.addToCollection(pair.folder, selected.schemaIdentifier)
						.catch(onFailedRequest)
						.then((response) => {
							if (response === undefined) {
								return;
							}

							addedToFolders.push({
								toastMessage: {
									maxLines: 3,
									title: t(
										'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-toegevoegd-aan-map-titel'
									),
									description: t(
										'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-toegevoegd-aan-map-beschrijving',
										descriptionVariables
									),
								},
								descriptionVariables,
							});
						});
				} else {
					return collectionsService
						.removeFromCollection(pair.folder, selected.schemaIdentifier)
						.catch(onFailedRequest)
						.then((response) => {
							if (response === undefined) {
								return;
							}

							removedFromFolders.push({
								toastMessage: {
									maxLines: 3,
									title: t(
										'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-verwijderd-uit-map-titel'
									),
									description: t(
										'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-verwijderd-uit-map-beschrijving',
										descriptionVariables
									),
								},
								descriptionVariables,
							});
						});
				}
			});

			// Execute calls
			Promise.all(promises).then(() => {
				getFolders.refetch().then(() => {
					// bundle add toast messages
					if (addedToFolders.length > 1) {
						const folders = addedToFolders
							.map((obj) => obj.descriptionVariables.folder)
							.join(', ');
						toastService.notify({
							maxLines: 3,
							title: t(
								'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-toegevoegd-aan-mappen-titel'
							),
							description: t(
								'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-toegevoegd-aan-mappen-beschrijving',
								{
									folders,
								}
							),
						});
					} else if (addedToFolders.length === 1) {
						toastService.notify(addedToFolders[0].toastMessage);
					}

					// bundle removed toast messages
					if (removedFromFolders.length > 1) {
						const folders = removedFromFolders
							.map((obj) => obj.descriptionVariables.folder)
							.join(', ');
						toastService.notify({
							maxLines: 3,
							title: t(
								'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-verwijderd-uit-mappen-titel'
							),
							description: t(
								'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-is-verwijderd-uit-mappen-beschrijving',
								{
									folders,
								}
							),
						});
					} else if (removedFromFolders.length === 1) {
						toastService.notify(removedFromFolders[0].toastMessage);
					}

					onSubmit?.(values);
					reset();
				});
			});
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
					label={t(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit, () => console.error(errors))}
					disabled={isSubmitting}
				/>

				<Button
					label={t(
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
						checkIcon={<Icon name="check" />}
						onClick={(e) => e.stopPropagation()}
						variants={['no-label']}
					/>

					<span className={styles['c-add-to-folder-blade__list-item__label']}>
						{collection?.name}
					</span>

					<span className={styles['c-add-to-folder-blade__list-item__count']}>
						{count === 1
							? t(
									'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___1-item'
							  )
							: t(
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
			footer={props.isOpen && renderFooter()}
			title={t(
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe-aan-map'
			)}
			className={clsx(props.className, styles['c-add-to-folder-blade'])}
		>
			<div className="u-px-32">
				<Html
					content={t(
						'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___kies-de-map-waaraan-je-strong-title-strong-wil-toevoegen',
						{ title }
					)}
				/>
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
										<CreateCollectionButton afterSubmit={getFolders.refetch} />
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

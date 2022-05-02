import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox } from '@meemoo/react-components';
import clsx from 'clsx';
import { Trans, useTranslation } from 'next-i18next';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';

import { CreateCollectionButton } from '@account/components';
import { useGetCollections } from '@account/hooks/get-collections';
import { collectionsService } from '@account/services/collections';
import { Collection } from '@account/types';
import { Blade, Icon } from '@shared/components';
import { toastService } from '@shared/services/toast-service';

import { ADD_TO_COLLECTION_FORM_SCHEMA } from './AddToCollectionBlade.const';
import styles from './AddToCollectionBlade.module.scss';
import {
	AddToCollectionBladeProps,
	AddToCollectionFormState,
	AddToCollectionFormStatePair,
	AddToCollectionSelected,
} from './AddToCollectionBlade.types';

const AddToCollectionBlade: FC<AddToCollectionBladeProps> = (props) => {
	const { t } = useTranslation();
	const { onSubmit, selected } = props;
	const [pairs, setPairs] = useState<AddToCollectionFormStatePair[]>([]);
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<AddToCollectionFormState>({
		resolver: yupResolver(ADD_TO_COLLECTION_FORM_SCHEMA()),
		defaultValues: useMemo(() => ({ pairs }), [pairs]),
	});

	const collections = useGetCollections(!!selected?.schemaIdentifier);

	/**
	 * Methods
	 */

	const mapToPairs = (collections: Collection[], selected: AddToCollectionSelected) => {
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

	const getCollection = (id: string) =>
		(collections.data?.items || []).find((collection) => collection.id === id);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (selected?.schemaIdentifier && collections.data) {
			setPairs(mapToPairs(collections.data?.items || [], selected));
		}
	}, [setValue, reset, collections.data, selected]);

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
		collections.refetch();

		toastService.notify({
			title: t(
				'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___er-ging-iets-mis'
			),
			description: t(
				'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___er-is-een-fout-opgetreden-tijdens-het-opslaan-probeer-opnieuw'
			),
		});
	};

	const onFormSubmit = (values: AddToCollectionFormState) => {
		if (selected) {
			const original = mapToPairs(collections.data?.items || [], selected);
			const dirty = values.pairs.filter((current) => {
				return (
					current.checked !== original.find((o) => o.folder === current.folder)?.checked
				);
			});

			// Define our promises
			const promises = dirty.map((pair) => {
				const collection = getCollection(pair.folder);

				const descriptionVariables = {
					item: selected.title,
					collection:
						collection?.name ||
						t(
							'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___onbekend'
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
							toastService.notify({
								maxLines: 3,
								title: t(
									'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___item-toegevoegd-aan-map'
								),
								description: t(
									'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___item-is-toegevoegd-aan-collection',
									descriptionVariables
								),
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

							toastService.notify({
								maxLines: 3,
								title: t(
									'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___item-verwijderd-uit-map'
								),
								description: t(
									'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___item-is-verwijderd-uit-collection',
									descriptionVariables
								),
							});
						});
				}
			});

			// Execute calls
			Promise.all(promises).then(() => {
				collections.refetch().then(() => {
					onSubmit?.(values);
					reset();
				});
			});
		}
	};

	const onCheckboxClick = (pair: AddToCollectionFormStatePair) => {
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
						'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___voeg-toe'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit, () => console.error(errors))}
				/>

				<Button
					label={t(
						'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={props.onClose}
				/>
			</div>
		);
	};

	const renderPairFields = (data: {
		field: ControllerRenderProps<AddToCollectionFormState, 'pairs'>;
	}) => {
		const { field } = data;

		return field.value.map((pair) => {
			const collection = getCollection(pair.folder);
			const others = (collection?.objects || []).filter(
				(object) => object.schemaIdentifier !== pair.ie
			);

			const count = others.length + (pair.checked ? 1 : 0);

			return (
				<li
					key={`item--${pair.folder}`}
					className={styles['c-add-to-collection-blade__list-item']}
					onClick={() => onCheckboxClick(pair)}
					tabIndex={0}
					role="button"
				>
					<Checkbox
						value={`add-to--${pair.folder}`}
						className={styles['c-add-to-collection-blade__list-item__checkbox']}
						checked={pair.checked}
						checkIcon={<Icon name="check" />}
						onClick={(e) => e.stopPropagation()}
						variants={['no-label']}
					/>

					<span className={styles['c-add-to-collection-blade__list-item__label']}>
						{collection?.name}
					</span>

					<span className={styles['c-add-to-collection-blade__list-item__count']}>
						{count === 1
							? t(
									'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___1-item'
							  )
							: t(
									'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___count-items',
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
			footer={renderFooter()}
			title={t(
				'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___voeg-toe-aan-map'
			)}
			className={clsx(props.className, styles['c-add-to-collection-blade'])}
		>
			<div className="u-px-32">
				<p>
					<Trans title={title}>
						Kies de map waaraan je <strong>{`"${title}"`}</strong> wil toevoegen.
					</Trans>
				</p>
			</div>

			<div className="u-px-32 u-bg-platinum">
				<ul className={clsx(styles['c-add-to-collection-blade__list'])}>
					<Controller
						name="pairs"
						control={control}
						render={(data) => (
							<>
								{renderPairFields(data)}

								<li className={styles['c-add-to-collection-blade__list-button']}>
									<CreateCollectionButton
										afterSubmit={() => collections.refetch()}
									/>
								</li>
							</>
						)}
					/>
				</ul>
			</div>
		</Blade>
	);
};

export default AddToCollectionBlade;

import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	ContentInput,
	FormControl,
	StopPropagationFunction,
} from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { COLLECTION_FORM_SCHEMA } from '@account/const';
import { collectionsService } from '@account/services/collections';
import { EditFolderFormState } from '@account/types';
import { Icon } from '@shared/components';
import { toastService } from '@shared/services/toast-service';

import styles from './EditCollectionTitle.module.scss';
import { EditCollectionTitleProps } from './EditCollectionTitle.types';

const EditCollectionTitle: FC<EditCollectionTitleProps> = ({
	afterSubmit = () => null,
	buttons = [],
	collection,
	onOpenNode = null,
}) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * Form
	 */

	const defaultName = collection.name;

	const {
		control,
		formState: { errors },
		handleSubmit,
		resetField,
	} = useForm<EditFolderFormState>({
		resolver: yupResolver(COLLECTION_FORM_SCHEMA()),
		defaultValues: {
			name: defaultName,
		},
	});

	/**
	 * Effects
	 */

	useEffect(() => {
		const description = [errors.name?.message].join(' ');
		description.length > 0 &&
			toastService.notify({
				title: t(
					'modules/account/components/edit-collection-title/edit-collection-title___er-was-een-probleem-bij-het-aanpassen-van-de-titel-van-de-map'
				),
				maxLines: 2,
				description,
			});
	}, [errors, t]);

	/**
	 * Events
	 */

	const resetForm = () => {
		resetField('name');
		setIsOpen(false);
	};

	const clearForm = () => {
		setIsOpen(true);
	};

	const onFormSubmit = () => {
		handleSubmit<EditFolderFormState>((values) => {
			collectionsService.update(collection.id, values).then((response) => {
				afterSubmit(response);

				toastService.notify({
					title: t(
						'modules/account/components/edit-collection-title/edit-collection-title___name-is-aangepast',
						values
					),
					description: t(
						'modules/account/components/edit-collection-title/edit-collection-title___deze-map-is-successvol-aangepast'
					),
				});
			});
		})();
	};

	/**
	 * Render
	 */

	const renderButtons = (handler: StopPropagationFunction) => {
		return (
			<>
				{buttons.filter((b) => b.before).map((b) => b.node)}
				<Button
					key={'edit-title'}
					onClick={handler}
					className={styles['c-edit-collection-title__edit']}
					variants={['silver']}
					name={t(
						'modules/account/components/edit-collection-title/edit-collection-title___map-aanpassen'
					)}
					icon={<Icon name="edit" />}
				/>
				{buttons.filter((b) => !b.before).map((b) => b.node)}
			</>
		);
	};

	return (
		<FormControl className={styles['c-edit-collection-title']}>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<ContentInput
						{...field}
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						iconEnd={(handler) => (!isOpen ? renderButtons(handler) : onOpenNode)}
						nodeCancel={<Button variants={['silver']} icon={<Icon name="times" />} />}
						nodeSubmit={<Button variants={['black']} icon={<Icon name="check" />} />}
						onClose={resetForm}
						onConfirm={onFormSubmit}
						onOpen={clearForm}
						spellCheck="false"
						variants={['title']}
					/>
				)}
			/>
		</FormControl>
	);
};

export default EditCollectionTitle;

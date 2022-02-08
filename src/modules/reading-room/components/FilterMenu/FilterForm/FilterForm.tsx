import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Icon } from '@shared/components';

import styles from './FilterForm.module.scss';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({ children, className, title }) => {
	const { t } = useTranslation();

	return (
		<div className={clsx(className, styles['c-filter-form'])}>
			<div className={styles['c-filter-form__body']}>
				<h2 className={styles['c-filter-form__title']}>{title}</h2>
				{children}
			</div>
			<div className={styles['c-filter-form__footer']}>
				<Button
					className={styles['c-filter-form__reset']}
					iconStart={<Icon name="redo" />}
					label={t('Reset')}
					variants="text"
				/>
				<Button
					className={styles['c-filter-form__submit']}
					label={t('Pas toe')}
					variants={['black']}
				/>
			</div>
		</div>
	);
};

export default FilterForm;

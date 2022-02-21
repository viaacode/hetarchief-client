import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Icon } from '@shared/components';

import styles from './FilterForm.module.scss';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({ className, form, title }) => {
	const { t } = useTranslation();

	const FormComponent = form ?? (() => null);

	return (
		<div className={clsx(className, styles['c-filter-form'])}>
			<div className={styles['c-filter-form__body']}>
				<h2 className={styles['c-filter-form__title']}>{title}</h2>
			</div>
			<FormComponent>
				{({ reset, values }) => (
					<div className={styles['c-filter-form__footer']}>
						<Button
							className={clsx(styles['c-filter-form__reset'], 'u-p-0 u-mr-40')}
							iconStart={<Icon name="redo" />}
							label={t(
								'modules/reading-room/components/filter-menu/filter-form/filter-form___reset'
							)}
							variants="text"
						/>
						<Button
							className={styles['c-filter-form__submit']}
							label={t(
								'modules/reading-room/components/filter-menu/filter-form/filter-form___pas-toe'
							)}
							variants={['black']}
						/>
					</div>
				)}
			</FormComponent>
		</div>
	);
};

export default FilterForm;

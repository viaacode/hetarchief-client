import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import type { FC } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import type { FilterFormButtonsProps } from '../FilterFormButtons/FilterFormButtons.types';
import styles from './FilterFormButtons.module.scss';

const FilterFormButtons: FC<FilterFormButtonsProps> = ({ onSubmit, onReset }) => {
	return (
		<div className={styles['c-filter-form__footer']}>
			<Button
				className={clsx(styles['c-filter-form__reset'], 'u-p-0 u-mr-40')}
				iconStart={<Icon className="u-font-size-22" name={IconNamesLight.Redo} />}
				label={tHtml(
					'modules/visitor-space/components/filter-menu/filter-form/filter-form___reset'
				)}
				variants="text"
				onClick={onReset}
			/>
			<Button
				className={styles['c-filter-form__submit']}
				label={tHtml(
					'modules/visitor-space/components/filter-menu/filter-form/filter-form___pas-toe'
				)}
				variants={['black']}
				onClick={onSubmit}
			/>
		</div>
	);
};

export default FilterFormButtons;

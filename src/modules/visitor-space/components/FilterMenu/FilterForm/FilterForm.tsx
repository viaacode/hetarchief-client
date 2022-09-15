import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { visitorSpaceLabelKeys } from '@visitor-space/const';

import styles from './FilterForm.module.scss';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	className,
	disabled,
	form,
	id,
	onFormReset,
	onFormSubmit,
	title,
	values,
}) => {
	const { tHtml } = useTranslation();

	const FormComponent = form ?? (() => null);

	const onFilterFormReset = (id: string, reset: () => void) => {
		reset();
		onFormReset(id);
	};

	const onFilterFormSubmit = (id: string, values: unknown) => {
		onFormSubmit(id, values);
	};

	return (
		<div className={clsx(className, styles['c-filter-form'])}>
			<div className={styles['c-filter-form__header']}>
				<h2 className={styles['c-filter-form__title']}>
					<label htmlFor={`${visitorSpaceLabelKeys.filters.title}--${id}`}>{title}</label>
				</h2>
			</div>

			<FormComponent
				disabled={disabled}
				className={styles['c-filter-form__body']}
				values={{ [id]: values }}
			>
				{({ reset, values, handleSubmit }) => (
					<div className={styles['c-filter-form__footer']}>
						<Button
							className={clsx(styles['c-filter-form__reset'], 'u-p-0 u-mr-40')}
							iconStart={<Icon className="u-font-size-22" name="redo" />}
							label={tHtml(
								'modules/visitor-space/components/filter-menu/filter-form/filter-form___reset'
							)}
							variants="text"
							onClick={() => onFilterFormReset(id, reset)}
						/>
						<Button
							className={styles['c-filter-form__submit']}
							label={tHtml(
								'modules/visitor-space/components/filter-menu/filter-form/filter-form___pas-toe'
							)}
							variants={['black']}
							onClick={() => {
								handleSubmit(
									() => onFilterFormSubmit(id, values),
									(...args) => console.error(args)
								)();
							}}
						/>
					</div>
				)}
			</FormComponent>
		</div>
	);
};

export default FilterForm;

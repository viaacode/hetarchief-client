import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import type { DefaultFilterFormProps, SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import { type FC, type ReactElement, useMemo } from 'react';

import { FilterMenuType } from '../FilterMenu.types';

import { HAS_SHOW_OVERFLOW } from './FilterForm.const';
import styles from './FilterForm.module.scss';
import type { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	className,
	disabled,
	form,
	id,
	onFormReset,
	onFormSubmit,
	title,
	initialValue,
	type,
}) => {
	const showOverflow = useMemo(
		(): boolean => HAS_SHOW_OVERFLOW.includes(id as SearchFilterId),
		[id]
	);

	const renderFilterFormByType = (): ReactElement => {
		switch (type) {
			case FilterMenuType.Modal:
				return renderModal();
			case FilterMenuType.Checkbox:
				return renderCheckbox();
			default:
				return <></>;
		}
	};

	const renderCheckbox = (): ReactElement => {
		const FormComponent = (form as FC<DefaultFilterFormProps>) ?? (() => null);

		return (
			<div className={clsx(className, styles['c-filter-form--inline'])}>
				<FormComponent
					// Make sure to force a rerender the form by setting a key
					key={`${id}-${JSON.stringify(initialValue)}`}
					id={id}
					label={title}
					onSubmit={onFormSubmit}
					onReset={() => onFormReset(id)}
					disabled={disabled}
					initialValue={initialValue}
				/>
			</div>
		);
	};

	const renderModal = (): ReactElement => {
		const FormComponent = (form as FC<DefaultFilterFormProps>) ?? (() => null);

		return (
			<div className={clsx(className, styles['c-filter-form'])} id={`c-filter-form--${id}`}>
				<div className={styles['c-filter-form__header']}>
					<h2 className={styles['c-filter-form__title']}>
						<label htmlFor={`${visitorSpaceLabelKeys.filters.title}--${id}`}>{title}</label>
					</h2>
				</div>

				<FormComponent
					disabled={disabled}
					className={clsx(styles['c-filter-form__body'], {
						[styles['c-filter-form__body--overflow']]: showOverflow,
					})}
					label={title}
					initialValue={initialValue}
					id={id}
					onSubmit={onFormSubmit}
					onReset={() => onFormReset(id)}
				/>
			</div>
		);
	};

	return renderFilterFormByType();
};

export default FilterForm;

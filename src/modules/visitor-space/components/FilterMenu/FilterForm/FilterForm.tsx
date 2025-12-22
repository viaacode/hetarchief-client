import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml } from '@shared/helpers/translate';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import type {
	DefaultFilterFormProps,
	InlineFilterFormProps,
	SearchFilterId,
} from '@visitor-space/types';
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
	values,
	type,
}) => {
	const onFilterFormReset = (id: SearchFilterId, reset: () => void) => {
		reset();
		onFormReset(id);
	};

	const onFilterFormSubmit = (id: SearchFilterId, values: unknown) => {
		onFormSubmit(id, values);
	};

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
				// biome-ignore lint/complexity/noUselessFragments: We want to return a ReactElement
				return <></>;
		}
	};

	const renderCheckbox = (): ReactElement => {
		const FormComponent = (form as FC<InlineFilterFormProps>) ?? (() => null);

		return (
			<div className={clsx(className, styles['c-filter-form--inline'])}>
				<FormComponent
					// Make sure to force a rerender the form by setting a key
					key={`${id}-${JSON.stringify(values)}`}
					id={id}
					label={title}
					onFormSubmit={onFormSubmit}
					disabled={disabled}
					values={{ [id]: values }}
				/>
			</div>
		);
	};

	const renderModal = (): ReactElement => {
		// biome-ignore lint/suspicious/noExplicitAny: No typing yet
		const FormComponent = (form as FC<DefaultFilterFormProps<any>>) ?? (() => null);

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
					values={{ [id]: values }}
				>
					{({ reset, values, handleSubmit }) => (
						<div className={styles['c-filter-form__footer']}>
							<Button
								className={clsx(styles['c-filter-form__reset'], 'u-p-0 u-mr-40')}
								iconStart={<Icon className="u-font-size-22" name={IconNamesLight.Redo} />}
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

	return renderFilterFormByType();
};

export default FilterForm;

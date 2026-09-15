import { Button, keysEnter, onKey } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { AutocompleteFilterForm } from '@visitor-space/components/AutocompleteFilterForm/AutocompleteFilterForm';
import { CheckboxListFilterForm } from '@visitor-space/components/CheckboxListFilterForm/CheckboxListFilterForm';
import { SearchableCheckboxFilterForm } from '@visitor-space/components/SearchableCheckboxFilterForm/SearchableCheckboxFilterForm';
import { TextFilterForm } from '@visitor-space/components/TextFilterForm/TextFilterForm';
import { visitorSpaceLabelKeys } from '@visitor-space/const/label-keys';
import {
	type DefaultFilterFormProps,
	FilterModalType,
	type GenericFilterFormProps,
	type InlineFilterFormProps,
	type SearchFilterId,
} from '@visitor-space/types';
import clsx from 'clsx';
import { noop } from 'es-toolkit/compat';
import { type FC, type KeyboardEvent, type ReactElement, useMemo, useRef } from 'react';

import { FilterMenuType } from '../FilterMenu.types';

import { HAS_SHOW_OVERFLOW } from './FilterForm.const';
import styles from './FilterForm.module.scss';
import type { FilterFormProps } from './FilterForm.types';

/** One generic form serves every filter of a modal type. See the FA of ARC-3806. */
const GENERIC_FILTER_FORM_BY_MODAL_TYPE: Partial<
	Record<FilterModalType, FC<GenericFilterFormProps>>
> = {
	[FilterModalType.SearchableCheckbox]: SearchableCheckboxFilterForm,
	[FilterModalType.CheckboxList]: CheckboxListFilterForm,
	[FilterModalType.Autocomplete]: AutocompleteFilterForm,
	[FilterModalType.Text]: TextFilterForm,
};

const FilterForm: FC<FilterFormProps> = ({
	className,
	disabled,
	filter,
	onFormReset,
	onFormSubmit,
	title,
	values,
}) => {
	const { form, id, type } = filter;

	const onFilterFormReset = (id: SearchFilterId, reset: () => void) => {
		reset();
		onFormReset(id);
	};

	const onFilterFormSubmit = (id: SearchFilterId, values: unknown) => {
		onFormSubmit(id, values);
	};

	// The children render prop owns the submit handler, so we keep a reference to it
	// to be able to submit from the enter key handler on the form wrapper.
	const submitFormRef = useRef<() => void>(noop);

	const onFilterFormKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
		// Let components that already handle enter themselves win, eg: react-select picking an option
		if (evt.defaultPrevented) {
			return;
		}

		const target = evt.target as HTMLElement;
		if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
			return;
		}

		onKey(evt, [...keysEnter], () => {
			evt.preventDefault();
			submitFormRef.current();
		});
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
		const FormComponent = (form as FC<InlineFilterFormProps>) ?? noop;

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
		// A filter without a form of its own uses the generic form of its modal type.
		// A form with its own component ignores the filter prop, a generic one reads it.
		const FormComponent = (form ??
			(filter.modalType ? GENERIC_FILTER_FORM_BY_MODAL_TYPE[filter.modalType] : undefined) ??
			noop) as FC<
			// biome-ignore lint/suspicious/noExplicitAny: No typing yet
			DefaultFilterFormProps<any> & Partial<Pick<GenericFilterFormProps, 'filter'>>
		>;

		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: The keydown handler is only a shortcut for the already focusable form fields inside
			<div
				className={clsx(className, styles['c-filter-form'])}
				id={`c-filter-form--${id}`}
				onKeyDown={onFilterFormKeyDown}
			>
				<div className={styles['c-filter-form__header']}>
					<h2 className={styles['c-filter-form__title']}>
						<label htmlFor={`${visitorSpaceLabelKeys.filters.title}--${id}`}>{title}</label>
					</h2>
				</div>

				<FormComponent
					disabled={disabled}
					filter={filter}
					className={clsx(styles['c-filter-form__body'], {
						[styles['c-filter-form__body--overflow']]: showOverflow,
					})}
					values={{ [id]: values }}
				>
					{({ reset, values, handleSubmit }) => {
						const submitForm = () => {
							handleSubmit(
								() => onFilterFormSubmit(id, values),
								(...args) => console.error(args)
							)();
						};
						submitFormRef.current = submitForm;

						return (
							<div className={styles['c-filter-form__footer']}>
								<Button
									className={clsx(styles['c-filter-form__reset'], 'u-p-0 u-mr-40')}
									iconStart={
										<Icon className="u-font-size-22" name={IconNamesLight.Redo} aria-hidden />
									}
									label={tText(
										'modules/visitor-space/components/filter-menu/filter-form/filter-form___reset'
									)}
									variants="text"
									onClick={() => onFilterFormReset(id, reset)}
								/>
								<Button
									className={styles['c-filter-form__submit']}
									label={tText(
										'modules/visitor-space/components/filter-menu/filter-form/filter-form___pas-toe'
									)}
									variants={['black']}
									onClick={submitForm}
								/>
							</div>
						);
					}}
				</FormComponent>
			</div>
		);
	};

	return renderFilterFormByType();
};

export default FilterForm;

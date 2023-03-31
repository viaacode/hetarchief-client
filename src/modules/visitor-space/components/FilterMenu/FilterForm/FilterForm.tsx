import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, ReactElement, useMemo } from 'react';

import { Icon, IconNamesLight } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { visitorSpaceLabelKeys } from '@visitor-space/const';
import {
	DefaultFilterFormProps,
	InlineFilterFormProps,
	VisitorSpaceFilterId,
} from '@visitor-space/types';

import { FilterMenuType } from '../FilterMenu.types';

import { HAS_SHOW_OVERFLOW } from './FilterForm.const';
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
	type,
}) => {
	const { tHtml } = useTranslation();

	const onFilterFormReset = (id: string, reset: () => void) => {
		reset();
		onFormReset(id);
	};

	const onFilterFormSubmit = (id: string, values: unknown) => {
		onFormSubmit(id, values);
	};

	const showOverflow = useMemo(
		(): boolean => HAS_SHOW_OVERFLOW.includes(id as VisitorSpaceFilterId),
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
		const FormComponent = (form as FC<DefaultFilterFormProps>) ?? (() => null);

		return (
			<div className={clsx(className, styles['c-filter-form'])}>
				<div className={styles['c-filter-form__header']}>
					<h2 className={styles['c-filter-form__title']}>
						<label htmlFor={`${visitorSpaceLabelKeys.filters.title}--${id}`}>
							{title}
						</label>
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
								iconStart={
									<Icon className="u-font-size-22" name={IconNamesLight.Redo} />
								}
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

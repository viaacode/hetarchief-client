import { keysEnter, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';

import { Icon, IconNamesLight } from '../Icon';

import styles from './VisitorSpaceDropdown.module.scss';
import {
	VisitorSpaceDropdownOption,
	VisitorSpaceDropdownProps,
} from './VisitorSpaceDropdown.types';

export const VisitorSpaceDropdown: FC<VisitorSpaceDropdownProps> = ({
	options,
	selectedOptionId,
	onSelected,
}: VisitorSpaceDropdownProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const hasMultipleOptions = useMemo(() => options.length > 1, [options]);

	const onClickDropdown = (): void => {
		setIsOpen((prevIsOpen: boolean) => !prevIsOpen);
	};

	const onSelectOption = (selectedOption: VisitorSpaceDropdownOption): void => {
		setIsOpen(false);
		onSelected(selectedOption.id);
	};

	const renderSelectedOption = () => {
		const selected = options.find(
			({ id }: VisitorSpaceDropdownOption) => id === selectedOptionId
		);

		const actionProps = hasMultipleOptions
			? {
					tabIndex: 0,
					role: 'button',
					['aria-expanded']: isOpen,
					['aria-controls']: 'list-controls',
					onClick: onClickDropdown,
					onKeyDown: (e) => onKey(e, [...keysEnter], onClickDropdown),
			  }
			: {};

		return (
			<li {...actionProps} className={clsx(styles['c-visitor-spaces-dropdown__active'])}>
				<div className={clsx(styles['c-visitor-spaces-dropdown__active-content'])}>
					<p
						className={clsx(
							'u-text-ellipsis',
							styles['c-visitor-spaces-dropdown__active-label']
						)}
					>
						{selected?.label}
					</p>
					{selected?.extraInfo && (
						<p
							className={clsx(
								'u-text-ellipsis',
								styles['c-visitor-spaces-dropdown__active-info']
							)}
						>
							{selected?.extraInfo}
						</p>
					)}
				</div>
				{hasMultipleOptions && (
					<Icon
						className={clsx(styles['c-visitor-spaces-dropdown__active-icon'])}
						name={IconNamesLight.AngleDown}
					/>
				)}
			</li>
		);
	};

	const renderAllOptions = () => (
		<li aria-hidden={!isOpen} id="list-controls">
			<ul
				className={clsx('u-list-reset', styles['c-visitor-spaces-dropdown__list'], {
					[styles['c-visitor-spaces-dropdown__list--open']]: isOpen,
				})}
			>
				{options.map((option: VisitorSpaceDropdownOption) => (
					<li
						key={option.id}
						role="option"
						aria-selected={selectedOptionId === option.id}
						onClick={() => onSelectOption(option)}
						onKeyDown={(e) => onKey(e, [...keysEnter], () => onSelectOption(option))}
						className={clsx(styles['c-visitor-spaces-dropdown__option'])}
					>
						<p className={clsx(styles['c-visitor-spaces-dropdown__option-label'])}>
							{option.label}
						</p>
					</li>
				))}
			</ul>
		</li>
	);

	return (
		<ul
			className={clsx('u-list-reset', styles['c-visitor-spaces-dropdown'], {
				[styles['c-visitor-spaces-dropdown--open']]: isOpen,
			})}
		>
			{renderSelectedOption()}
			{hasMultipleOptions && renderAllOptions()}
		</ul>
	);
};

export default VisitorSpaceDropdown;

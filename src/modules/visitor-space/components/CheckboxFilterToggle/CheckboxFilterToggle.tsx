import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import clsx from 'clsx';
import type { FC } from 'react';

interface CheckboxFilterToggleProps {
	label: string;
	value: boolean;
	onChange: (isChecked: boolean) => void;
	className?: string;
}

/**
 * A single checkbox row in the filter panel, for a filter that is on or off. Not to be confused
 * with the CheckboxListFilterForm, which is the modal that holds a list of checkboxes.
 */
const CheckboxFilterToggle: FC<CheckboxFilterToggleProps> = ({
	label,
	value,
	onChange,
	className,
}) => {
	return (
		<div className={clsx('u-color-white', className)}>
			<Checkbox
				variants={['light', 'reverse']}
				label={label}
				checked={value}
				checkIcon={<Icon name={IconNamesLight.Check} aria-hidden />}
				onKeyDown={(e) => {
					onKey(e, [...keysEnter, ...keysSpacebar], () => {
						if (keysSpacebar.includes(e.key)) {
							e.preventDefault();
						}

						onChange(!value);
					});
				}}
				onClick={() => onChange(!value)}
			/>
		</div>
	);
};

export default CheckboxFilterToggle;

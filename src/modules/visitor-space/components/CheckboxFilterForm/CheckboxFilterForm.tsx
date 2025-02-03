import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import type { FC } from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

export interface CheckboxFilterFormProps {
	label: string;
	value: boolean;
	onChange: (isChecked: boolean) => void;
	className?: string;
}

const CheckboxFilterForm: FC<CheckboxFilterFormProps> = ({ label, value, onChange, className }) => {
	return (
		<div className={clsx('u-color-white', className)}>
			<Checkbox
				variants={['light', 'reverse']}
				label={label}
				checked={value}
				checkIcon={<Icon name={IconNamesLight.Check} />}
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

export default CheckboxFilterForm;

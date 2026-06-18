import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { FC } from 'react';

type MaterialRequestsArchiveCheckboxProps = {
	className: string;
	checkboxClassName: string;
	label: string;
	checked: boolean;
	onToggle: () => void;
	blurOnClick?: boolean;
};

export const MaterialRequestsArchiveCheckbox: FC<MaterialRequestsArchiveCheckboxProps> = ({
	className,
	checkboxClassName,
	label,
	checked,
	onToggle,
}) => {
	return (
		<div className={className}>
			<Checkbox
				className={checkboxClassName}
				label={label}
				checked={checked}
				checkIcon={<Icon name={IconNamesLight.Check} aria-hidden />}
				onKeyDown={(e) => {
					onKey(e, [...keysEnter, ...keysSpacebar], () => {
						if (keysSpacebar.includes(e.key)) {
							e.preventDefault();
						}
						onToggle();
					});
				}}
				onClick={(e) => {
					onToggle();
					e.currentTarget.blur();
				}}
			/>
		</div>
	);
};

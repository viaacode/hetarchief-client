import { RadioButton } from '@meemoo/react-components';
import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';

import styles from './SelectDateOrYear.module.scss';

interface SelectDateOrYearProps {
	yearsSelected: boolean;
	setYearsSelected: (bool: boolean) => void;
	showPluralLabel?: boolean;
}

const SelectDateOrYear: FC<SelectDateOrYearProps> = ({
	yearsSelected,
	setYearsSelected,
	showPluralLabel = false,
}) => {
	return (
		<div className={styles['radiobuttons-container']}>
			<RadioButton
				className={styles['radiobuttons-container__radiobutton']}
				checked={!yearsSelected}
				label={
					showPluralLabel
						? tText(
								'modules/visitor-space/components/created-filter-form/created-filter-form___datums'
							)
						: tText(
								'modules/visitor-space/components/created-filter-form/created-filter-form___datum'
							)
				}
				onClick={() => setYearsSelected(false)}
			/>
			<RadioButton
				className={styles['radiobuttons-container__radiobutton']}
				checked={yearsSelected}
				label={
					showPluralLabel
						? tText(
								'modules/visitor-space/components/created-filter-form/created-filter-form___jaartallen'
							)
						: tText(
								'modules/visitor-space/components/created-filter-form/created-filter-form___jaartal'
							)
				}
				onClick={() => setYearsSelected(true)}
			/>
		</div>
	);
};

export default SelectDateOrYear;

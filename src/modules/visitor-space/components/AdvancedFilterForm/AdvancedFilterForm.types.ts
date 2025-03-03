import type { FilterValue } from '../../types';

export interface AdvancedFilterFormProps {
	className?: string;
	disabled?: boolean;
	onSubmit: (newFormValues: FilterValue[]) => void;
	onReset: () => void;
	initialValues?: FilterValue[];
}

import { ReactNode } from 'react';

export interface CreateCollectionButtonProps {
	afterSubmit?: () => void;
	onOpenNode?: ReactNode | null;
}

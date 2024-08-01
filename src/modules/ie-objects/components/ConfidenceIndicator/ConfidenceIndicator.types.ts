import { type DefaultComponentProps } from '@shared/types';

export interface ConfidenceIndicatorProps extends DefaultComponentProps {
	confidence: number;
	className?: string;
}

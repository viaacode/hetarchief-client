import type { FC } from 'react';
import styles from './BladeStepSubtitle.module.scss';

interface BladeStepSubtitleProps {
	label: string;
}

export const BladeStepSubtitle: FC<BladeStepSubtitleProps> = ({ label }) => {
	return <span className={styles['c-blade-step-subtitle']}>{label}</span>;
};

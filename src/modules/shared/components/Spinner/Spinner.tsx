import type { CSSProperties, FC } from 'react';

import styles from './Spinner.module.scss';

export type SpinnerProps = {
	style?: CSSProperties;
};

export const Spinner: FC<SpinnerProps> = ({ style = {} }) => {
	return (
		<div className={styles['c-spinner']} style={style}>
			<svg
				role="img"
				aria-label="Bezig met laden"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
			>
				<circle
					cx="12"
					cy="12"
					r="9"
					stroke="#00857d"
					stroke-width="3"
					stroke-linecap="round"
					stroke-dasharray="45.6 11.4"
					transform="rotate(-90 12 12)"
				/>
			</svg>
		</div>
	);
};

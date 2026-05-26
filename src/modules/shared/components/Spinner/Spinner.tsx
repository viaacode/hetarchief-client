import type { CSSProperties, FC } from 'react';

import styles from './Spinner.module.scss';

export type SpinnerProps = {
	style?: CSSProperties;
	size?: number;
};

export const Spinner: FC<SpinnerProps> = ({ style = {}, size = 24 }) => {
	return (
		<div
			className={styles['c-spinner']}
			style={{
				...style,
				width: size,
				height: size,
			}}
		>
			<svg
				role="img"
				aria-label="Bezig met laden"
				width="100%"
				height="100%"
				viewBox="0 0 24 24"
				fill="none"
			>
				<circle
					cx="12"
					cy="12"
					r="9"
					stroke="#00857d"
					strokeWidth="2.25"
					strokeLinecap="round"
					strokeDasharray="45.6 11.4"
					transform="rotate(-90 12 12)"
				/>
			</svg>
		</div>
	);
};

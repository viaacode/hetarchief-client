import clsx from 'clsx';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import WaveformData from 'waveform-data';

import { useGetDefaultPeak } from '@shared/hooks/get-default-peak';

import styles from './Peak.module.scss';
import { PeakProps } from './Peak.types';

const Peak: FC<PeakProps> = ({ json, className }) => {
	const { data: fallback } = useGetDefaultPeak(!json);
	const [waveform, setWaveform] = useState<WaveformData | undefined>(undefined);

	const canvas = useRef<HTMLCanvasElement>(null);

	const data = json || fallback;

	const draw = useCallback(() => {
		const ctx = canvas.current?.getContext('2d');

		if (!ctx || !waveform) {
			return;
		}

		const step = 8;
		const spacing = step * 0.5;

		const scaleY = (amplitude: number, height: number) => {
			const range = 128;
			const offset = 64;

			return height - ((amplitude + offset) * height) / range;
		};

		ctx.clearRect(0, 0, canvas.current?.width || 0, canvas.current?.height || 0);
		ctx.fillStyle = '#ADADAD';

		const channel = waveform.channel(0);
		const half = (canvas.current?.height || 0) / 2;

		// Draw the upper half of the waveform
		for (let x = 0; x < waveform.length; x = x + step) {
			const val = channel.max_sample(x);
			const h = scaleY(val, half);

			ctx.rect(x, half - h, spacing, h * 2);
		}

		ctx.fill();
	}, [waveform]);

	useEffect(() => {
		window.addEventListener('resize', draw);
		return () => {
			window.removeEventListener('resize', draw);
		};
	}, [draw]);

	useEffect(() => {
		data && setWaveform(WaveformData.create(data));
	}, [data]);

	useEffect(() => {
		draw();
	}, [draw]);

	return (
		<canvas
			ref={canvas}
			className={clsx(styles['c-peak'], className)}
			width="1212"
			height="779"
		/>
	);
};

export default Peak;

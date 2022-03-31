import { FC, useEffect, useRef, useState } from 'react';
import WaveformData from 'waveform-data';

import { useGetDefaultPeak } from '@shared/hooks/get-default-peak';

import { PeakProps } from './Peak.types';

const Peak: FC<PeakProps> = ({ json }) => {
	const { data: fallback } = useGetDefaultPeak(!json);
	const [waveform, setWaveform] = useState<WaveformData | undefined>(undefined);

	const canvas = useRef<HTMLCanvasElement>(null);

	const data = json || fallback;

	useEffect(() => {
		const draw = () => {
			const ctx = canvas.current?.getContext('2d');
			if (!ctx || !waveform) {
				return;
			}

			const scaleY = (amplitude: number, height?: number) => {
				const h = height || 0;
				const range = 256;
				const offset = 128;

				return h - ((amplitude + offset) * h) / range;
			};

			ctx?.beginPath();

			const channel = waveform.channel(0);

			// Loop forwards, drawing the upper half of the waveform
			for (let x = 0; x < waveform.length; x++) {
				const val = channel.max_sample(x);

				ctx.lineTo(x + 0.5, scaleY(val, canvas.current?.height) + 0.5);
			}

			// Loop backwards, drawing the lower half of the waveform
			for (let x = waveform.length - 1; x >= 0; x--) {
				const val = channel.min_sample(x);

				ctx.lineTo(x + 0.5, scaleY(val, canvas.current?.height) + 0.5);
			}

			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		};

		data && waveform === undefined && setWaveform(WaveformData.create(data));
		draw();
	}, [data, waveform]);

	return (
		<div className="c-peak">
			<canvas ref={canvas} style={{ width: '100%', height: '56px' }} />
		</div>
	);
};

export default Peak;

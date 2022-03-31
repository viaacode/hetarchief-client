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
		data && setWaveform(WaveformData.create(data));
	}, [data]);

	useEffect(() => {
		const draw = () => {
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

				ctx.rect(x, half - h, spacing, h);
			}

			// Draw the lower half of the waveform
			for (let x = 0; x < waveform.length; x = x + step) {
				const val = channel.min_sample(x);
				const h = scaleY(val, half);

				ctx.rect(x, half, spacing, h);
			}

			ctx.fill();
		};

		draw();
	}, [waveform]);

	return (
		<div className="c-peak">
			<canvas ref={canvas} style={{ width: '100%', height: '56px' }} />
		</div>
	);
};

export default Peak;

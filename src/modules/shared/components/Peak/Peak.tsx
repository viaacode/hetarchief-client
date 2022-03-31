import { FC, useEffect, useRef, useState } from 'react';

import { useGetDefaultPeak } from '@shared/hooks/get-default-peak';

import { PeakProps } from './Peak.types';

const Peak: FC<PeakProps> = ({ json }) => {
	const { data: fallback } = useGetDefaultPeak(!json);

	const overview = useRef<HTMLDivElement>(null);

	const [lib, setLib] = useState<any>(undefined);

	const PeaksJS: any | undefined = lib && lib.default;
	const data = json || fallback;

	useEffect(() => {
		const getPeaks = async () => setLib(await import('peaks.js'));

		if (overview.current !== null && data && lib === undefined) {
			getPeaks();
		}
	}, [data, json, lib]);

	useEffect(() => {
		if (PeaksJS && overview.current && data) {
			const options = {
				mediaElement: document.createElement('audio'),
				overview: {
					container: overview.current,
					showAxisLabels: false,
					axisGridlineColor: 'transparent',
				},
				waveformData: {
					json: data,
				},
				playheadColor: 'transparent',
				waveformColor: '#ADADAD',
			};

			// Init and forget
			PeaksJS.init(options, (err: Error) => {
				err !== null && console.error(err);
			});
		}
	}, [PeaksJS, data]);

	return (
		<div className="c-peak">
			<div
				className="c-peak-overview"
				style={{ height: '160px', width: '100%' }}
				ref={overview}
			/>
		</div>
	);
};

export default Peak;

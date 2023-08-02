import L from 'leaflet';
import 'leaflet-iiif';
import React, { FC, useEffect, useRef } from 'react';

type IIIFLeafletViewerProps = {
	image: any;
};

const IIIFLeafletViewer: FC<IIIFLeafletViewerProps> = ({ image }) => {
	const container = useRef(null);
	useEffect(() => {
		if (container) {
			const map = L.map(container.current, {
				center: [0, 0],
				crs: L.CRS.Simple,
				zoom: 0,
			});

			L.tileLayer.iiif(image).addTo(map);
		}
	}, [container]);

	return (
		<div
			ref={container}
			style={{
				height: '800px',
				width: '1200px',
			}}
		/>
	);
};

export default IIIFLeafletViewer;

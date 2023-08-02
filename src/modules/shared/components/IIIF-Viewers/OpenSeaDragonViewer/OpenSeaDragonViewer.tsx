import OpenSeaDragon, { Viewer } from 'openseadragon';
import React, { FC, useEffect, useState } from 'react';

type OpenSeaDragonViewerProps = { image: any };

const OpenSeaDragonViewer: FC<OpenSeaDragonViewerProps> = ({ image }) => {
	const [viewer, setViewer] = useState<Viewer>();
	// useEffect(() => {
	// 	if (image && viewer) {
	// 		viewer.open(image.source);
	// 	}
	// }, [image, viewer]);

	const InitOpenseadragon = () => {
		viewer && viewer.destroy();
		setViewer(
			OpenSeaDragon({
				id: 'openSeaDragon',
				animationTime: 0.5,
				blendTime: 0.1,
				constrainDuringPan: true,
				maxZoomPixelRatio: 2,
				minZoomLevel: 1,
				visibilityRatio: 1,
				zoomPerScroll: 2,
				preserveViewport: true,
				defaultZoomLevel: 1,
				sequenceMode: true,

				tileSources: [image],
			})
		);
	};

	useEffect(() => {
		InitOpenseadragon();
		return () => {
			viewer && viewer.destroy();
		};
	}, []);

	return (
		<div
			id="openSeaDragon"
			style={{
				height: '800px',
				width: '1200px',
			}}
		/>
	);
};
export default OpenSeaDragonViewer;

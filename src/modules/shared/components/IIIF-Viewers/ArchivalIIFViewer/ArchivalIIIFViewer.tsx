import ArchivalIIIFViewer from '@archival-iiif/viewer';
import React, { FC, useEffect, useRef } from 'react';

type ArchivalIIFViewerProps = { manifestUrl: string };

const ArchivalViewer: FC<ArchivalIIFViewerProps> = ({ manifestUrl }) => {
	const container = useRef(null);

	useEffect(() => {
		if (container) {
			new ArchivalIIIFViewer({ id: container.current, manifest: manifestUrl });
		}
	}, [container]);
	return <div ref={container} />;
};

export default ArchivalViewer;

import mirador from 'mirador';
import React, { FC, useEffect, useRef } from 'react';

const MiradorViewer: FC = () => {
	const viewer = useRef(null);

	useEffect(() => {
		if (viewer.current) {
			mirador.viewer({ id: viewer.current });
		}
	}, []);

	return <div ref={viewer} />;
};

export default MiradorViewer;

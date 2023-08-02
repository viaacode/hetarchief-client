import Diva from 'diva.js/build/diva';
import React, { FC, useEffect, useRef } from 'react';

type Props = { manifestId: string };

const DivaViewer: FC<Props> = ({ manifestId }) => {
	const ref = useRef(null);

	useEffect(() => {
		if (ref.current && window) {
			// Gives type error
			// TypeError: diva_js_build_diva__WEBPACK_IMPORTED_MODULE_1___default() is not a constructor
			const diva = new Diva(ref.current, { objectData: manifestId });
			console.log(diva);
		}
	}, [ref, window]);
	return <div ref={ref} />;
};

export default DivaViewer;

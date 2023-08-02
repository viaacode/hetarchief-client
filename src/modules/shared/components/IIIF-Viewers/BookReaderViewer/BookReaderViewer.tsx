import BookReader from '@internetarchive/bookreader';
import React, { FC, useEffect, useRef } from 'react';

type BookReaderViewerProps = { manifestUrl: string };

const BookReaderViewer: FC<BookReaderViewerProps> = ({ manifestUrl }) => {
	const container = useRef(null);

	useEffect(() => {
		const viewer = new BookReader({});
		viewer.IIIF({ url: manifestUrl, initCallback: console.log });
		viewer.init();
	}, [container]);

	return <div ref={container} />;
};

export default BookReaderViewer;

import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { ComponentType, FC, ReactNode, useEffect, useRef } from 'react';

import { ArchivalIIIFViewer } from '@shared/components/IIIF-Viewers/ArchivalIIFViewer/ArchivalIIIFViewerLazy';
import BookReaderViewer from '@shared/components/IIIF-Viewers/BookReaderViewer/BookReaderViewer';
import { CloverIIIFViewer } from '@shared/components/IIIF-Viewers/CloverIIIF/CloverIIIFViewer';
import { DivaViewer } from '@shared/components/IIIF-Viewers/DivaViewer/DivaViewerLazy';
import { IIIFLeafletViewer } from '@shared/components/IIIF-Viewers/IIIFLeafletViewer/IIIFLeafletViewerLazy';
import { OpenSeaDragonViewer } from '@shared/components/IIIF-Viewers/OpenSeaDragonViewer/OpenSeaDragonViewerLazy';
import { UniversalViewer } from '@shared/components/IIIF-Viewers/UniversalViewer/UniversalViewerLazy';

const TripleIViewer: NextPage = () => {
	const manifestUrl =
		'https://iiif.bodleian.ox.ac.uk/iiif/manifest/5d5ac32a-3812-438a-b014-ecd600b6a03b.json';

	const imageUrl =
		'https://iiif.bodleian.ox.ac.uk/iiif/image/1363b336-260d-4f22-a6cf-4e1320dbb689/info.json';
	const { data } = useQuery(['GET_BODLEIAN_COLLECTION'], async () => {
		const response = await fetch(manifestUrl, {
			headers: {
				'Content-Type': 'application/ld+json',
			},
		});
		return await response.json();
	});
	console.log(data);

	return (
		<div className="l-container">
			{/* <UniversalViewer
				manifestId={manifestUrl}
				canvasIndex={0}
				onChangeCanvas={(canvasIndex) => {
					console.log('canvas index changed', canvasIndex);
				}}
				onChangeManifest={(manifest) => {
					console.log('manifest changed', manifest);
				}}
				config={{}}
			/> */}

			{/* <MiradorViewer /> */}

			{/* <CloverIIIFViewer id={manifestUrl} /> */}

			{/* <DivaViewer manifestId={manifestUrl} /> */}

			{/* <OpenSeaDragonViewer image={imageUrl} /> */}

			{/* <IIIFLeafletViewer image={imageUrl} /> */}

			{/* <BookReaderViewer manifestUrl={manifestUrl} /> */}
			<ArchivalIIIFViewer manifestUrl={manifestUrl} />
		</div>
	);
};

export default TripleIViewer;

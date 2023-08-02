import dynamic from 'next/dynamic';

export const ArchivalIIIFViewer = dynamic(() => import('./ArchivalIIIFViewer'), {
	ssr: false,
});

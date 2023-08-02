import dynamic from 'next/dynamic';

export const OpenSeaDragonViewer = dynamic(() => import('./OpenSeaDragonViewer'), {
	ssr: false,
});

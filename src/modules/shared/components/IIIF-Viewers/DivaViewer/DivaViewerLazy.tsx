import dynamic from 'next/dynamic';

export const DivaViewer = dynamic(() => import('./DivaViewer'), {
	ssr: false,
});

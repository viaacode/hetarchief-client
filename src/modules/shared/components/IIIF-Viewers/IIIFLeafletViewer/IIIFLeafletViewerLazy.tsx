import dynamic from 'next/dynamic';

export const IIIFLeafletViewer = dynamic(() => import('./IIIFLeafletViewer'), {
	ssr: false,
});

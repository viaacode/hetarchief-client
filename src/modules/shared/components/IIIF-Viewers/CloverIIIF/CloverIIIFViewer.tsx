import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

export const CloverIIIFViewer: ComponentType<{
	canvasIdCallback?: (arg0: string) => void;
	customTheme?: any;
	id: string;
	manifestId?: string;
	options?: any;
}> = dynamic(() => import('@samvera/clover-iiif'), {
	ssr: false,
});

import Metadata from '@ie-objects/components/Metadata/Metadata';
import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import MetaDataFieldWithHighlightingAndMaxLength from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength';
import { isString } from 'es-toolkit/compat';
import type { ReactNode } from 'react';

export const renderSimpleMetadataField = (
	title: string,
	data: string | ReactNode | null | undefined,
	onReadMoreClicked: (item: MetadataItem) => void
): ReactNode => {
	if (!data) {
		return null;
	}
	if (isString(data)) {
		return (
			<Metadata title={title} key={`metadata-${title}`}>
				<MetaDataFieldWithHighlightingAndMaxLength
					title={title}
					data={data}
					onReadMoreClicked={onReadMoreClicked}
				/>
			</Metadata>
		);
	}
	return (
		<Metadata title={title} key={`metadata-${title}`}>
			{data}
		</Metadata>
	);
};

import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import type { DefaultComponentProps } from '@meemoo/admin-core-ui/admin';
import { Button } from '@meemoo/react-components';
import HighlightedMetadata from '@shared/components/HighlightedMetadata/HighlightedMetadata';
import { tText } from '@shared/helpers/translate';
import { isString } from 'es-toolkit/compat';
import type { FC, ReactNode } from 'react';
import { METADATA_FIELD_MAX_LENGTH } from './MetaDataFieldWithHighlightingAndMaxLength.const';
import styles from './MetaDataFieldWithHighlightingAndMaxLength.module.scss';

interface MetaDataFieldWithHighlightingAndMaxLengthProps extends DefaultComponentProps {
	title: string;
	data: string;
	onReadMoreClicked: (item: MetadataItem) => void;
	enableHighlighting?: boolean;
	maxLength?: number;
	/** Visual style of the "Lees meer" button. 'onHeader' renders the bold black style used on the
	 * object detail page header's purple background, instead of the default neutral/underlined style. */
	readMoreButtonVariant?: 'default' | 'onHeader';
}

const MetaDataFieldWithHighlightingAndMaxLength: FC<
	MetaDataFieldWithHighlightingAndMaxLengthProps
> = ({
	title,
	data,
	className,
	onReadMoreClicked,
	enableHighlighting = true,
	maxLength = METADATA_FIELD_MAX_LENGTH,
	readMoreButtonVariant = 'default',
}) => {
	const isLongFieldData: boolean = isString(data) && data.length > maxLength;

	const parsedFieldData: string | ReactNode = isLongFieldData
		? `${(data as string).substring(0, maxLength)}...`
		: data;

	return (
		<div className={className}>
			{/* ARC-1282: if there are issues with showing \\n or not showing new lines,
				the parsedDescription used to be in a <TextWithNewLines /> component. This component was removed here to highlight text */}
			<HighlightedMetadata title={title} data={parsedFieldData} enabled={enableHighlighting} />

			{isLongFieldData && (
				// A literal space (not CSS margin) before the button: when this wraps onto its own
				// line, the browser collapses trailing whitespace at the line break, so it doesn't
				// carry the false indent that a margin-left would render at the start of that line.
				<>
					{' '}
					<Button
						variants={['text', 'sm']}
						className={
							readMoreButtonVariant === 'onHeader'
								? styles['c-metadata__field__blade__read-more--on-header']
								: styles['c-metadata__field__blade__read-more']
						}
						onClick={() => onReadMoreClicked({ title, data })}
						onKeyUp={(evt) => {
							if (evt.key === 'Enter') {
								onReadMoreClicked({ title, data });
							}
						}}
					>
						{tText('modules/visitor-space/utils/metadata/metadata___lees-meer')}
					</Button>
				</>
			)}
		</div>
	);
};

export default MetaDataFieldWithHighlightingAndMaxLength;

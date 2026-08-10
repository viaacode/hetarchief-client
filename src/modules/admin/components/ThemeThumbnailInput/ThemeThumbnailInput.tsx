import FileInput from '@shared/components/FileInput/FileInput';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { DEFAULT_ALLOWED_MIME_TYPES } from '@shared/helpers/validate-file';
import clsx from 'clsx';
import { type DragEvent, type FC, useRef, useState } from 'react';

import styles from './ThemeThumbnailInput.module.scss';

export interface ThemeThumbnailInputProps {
	/** Existing thumbnail url, or a local object url for a freshly picked file */
	imageUrl: string | null;
	onFileSelected: (file: File) => void;
	className?: string;
}

/**
 * Thumbnail picker for a theme: a drop zone that doubles as a 16:9 preview, plus an upload button.
 *
 * The preview is always 16:9 regardless of the source ratio, so a meemoo admin sees the thumbnail
 * exactly as content blocks will crop it.
 *
 * Accessibility: the drop zone is clickable but deliberately not a tab stop. The FileInput button
 * below it owns the input and is fully keyboard operable, so every function is reachable without
 * creating two focusable controls for the same action.
 */
export const ThemeThumbnailInput: FC<ThemeThumbnailInputProps> = ({
	imageUrl,
	onFileSelected,
	className,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);

	const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
		event.preventDefault();
		setIsDraggedOver(false);

		const file = event.dataTransfer?.files?.[0];
		if (file) {
			onFileSelected(file);
		}
	};

	return (
		<div className={clsx(className, styles['c-theme-thumbnail-input'])}>
			{/* aria-hidden: the FileInput below owns the input and is the keyboard path */}
			<div
				className={clsx(styles['c-theme-thumbnail-input__dropzone'], {
					[styles['c-theme-thumbnail-input__dropzone--dragged-over']]: isDraggedOver,
					[styles['c-theme-thumbnail-input__dropzone--has-image']]: !!imageUrl,
				})}
				onClick={() => fileInputRef.current?.click()}
				onDragOver={(event) => {
					event.preventDefault();
					setIsDraggedOver(true);
				}}
				onDragLeave={() => setIsDraggedOver(false)}
				onDrop={handleDrop}
				aria-hidden
			>
				{imageUrl ? (
					// biome-ignore lint/performance/noImgElement: src is a blob: object url as soon as the admin picks a file, which next/image cannot render at all. Stored thumbnails will live on the asset server, which remotePatterns already covers, but the blob case remains either way, and this admin-only preview is never above the fold
					<img
						className={styles['c-theme-thumbnail-input__preview']}
						src={imageUrl}
						alt={tText(
							'modules/admin/components/theme-thumbnail-input/theme-thumbnail-input___voorbeeld-van-de-thumbnail'
						)}
					/>
				) : (
					<span className={styles['c-theme-thumbnail-input__placeholder']}>
						<Icon name={IconNamesLight.Image} aria-hidden />
						<span>
							{tHtml(
								'modules/admin/components/theme-thumbnail-input/theme-thumbnail-input___sleep-een-afbeelding-hierheen-of-klik-om-te-bladeren'
							)}
						</span>
					</span>
				)}
			</div>

			<FileInput
				ref={fileInputRef}
				className={styles['c-theme-thumbnail-input__button']}
				hasFile={!!imageUrl}
				// Same list validateFile() enforces, so the picker cannot offer a file it would reject
				accept={DEFAULT_ALLOWED_MIME_TYPES.join(',')}
				onChange={(event) => {
					const file = event.currentTarget?.files?.[0];
					if (file) {
						onFileSelected(file);
					}
				}}
			/>
		</div>
	);
};

export default ThemeThumbnailInput;

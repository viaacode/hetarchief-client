import { useSendMaterialRequestMessage } from '@account/components/MaterialRequestDetailBlade/hooks/useSendMaterialRequestMessage';
import { isMaterialRequestClosed } from '@account/utils/is-material-request-closed';
import type { MaterialRequest } from '@material-requests/types';
import {
	Button,
	keysEnter,
	RichTextEditorWithInternalState,
	TagList,
} from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import React, {
	type FC,
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import styles from './MaterialRequestConversation.module.scss';
import { MessageFileUpload } from './MessageFileUpload';

type MaterialRequestConversationInputProps = {
	materialRequest: MaterialRequest;
	onAttachmentsChanged: (fileListHeight: number) => void;
};

export const MaterialRequestConversationInput: FC<MaterialRequestConversationInputProps> = memo(
	({ materialRequest, onAttachmentsChanged }) => {
		const fileListRef = useRef<HTMLDivElement>(null);
		const [editorKey, setEditorKey] = useState(uuid()); // To force rich text editor to rerender
		const editorId = `material-request-conversation--${editorKey}`;

		const [currentMessage, setCurrentMessage] = useState<string>('');
		const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

		const { mutate: sendMessage, isPending: isSending } = useSendMaterialRequestMessage(
			materialRequest.id
		);

		const isMessageEmpty = useMemo(() => {
			const textContent = currentMessage.replace(/<[^>]*>/g, '').trim();
			return !textContent;
		}, [currentMessage]);

		const inputDisabled = useMemo(
			() => isSending || isMaterialRequestClosed(materialRequest),
			[isSending, materialRequest]
		);

		const sendMessageDisabled = useMemo(
			() => (isMessageEmpty && selectedFiles.length === 0) || inputDisabled,
			[isMessageEmpty, selectedFiles, inputDisabled]
		);

		const handleSendMessage = useCallback(() => {
			if (sendMessageDisabled) {
				return;
			}

			// Send single message with text and all selected files
			sendMessage(
				{ message: currentMessage, files: selectedFiles },
				{
					onSuccess: () => {
						setCurrentMessage('');
						setSelectedFiles([]);
						setEditorKey(uuid()); // Force rerender of rich text editor
					},
					onError: (err) => {
						console.error(err);
						toastService.notify({
							maxLines: 3,
							title: tText(
								'modules/account/components/material-request-detail-blade/material-request-conversation___er-ging-iets-mis'
							),
							description: tText(
								'modules/account/components/material-request-detail-blade/material-request-conversation___het-bericht-kon-niet-worden-verzonden'
							),
						});
					},
				}
			);
		}, [sendMessageDisabled, currentMessage, selectedFiles, sendMessage]);

		// Measure the file list height and adjust message wrapper accordingly
		// biome-ignore lint/correctness/useExhaustiveDependencies: We want to re-measure when files are added or removed
		useLayoutEffect(() => {
			if (fileListRef.current) {
				onAttachmentsChanged(fileListRef.current.offsetHeight);
			}
		}, [selectedFiles]);

		const getEditorAndFocusOrDisable = useCallback(() => {
			const braftComponent = document.querySelector(
				`#${editorId} .DraftEditor-editorContainer .public-DraftEditor-content`
			) as HTMLDivElement;

			if (braftComponent) {
				braftComponent?.focus();

				const isDisabled = isMaterialRequestClosed(materialRequest);
				const braftControls = document.querySelectorAll<HTMLElement>(
					'.bf-controlbar button.control-item, .bf-controlbar .dropdown-handler'
				);

				braftControls.forEach((control) => {
					control.tabIndex = isDisabled ? -1 : 0;
				});

				return true;
			}
			return false;
		}, [editorId, materialRequest]);

		useEffect(() => {
			let success = getEditorAndFocusOrDisable();

			if (success) {
				return;
			}

			const observer = new MutationObserver((_, observer) => {
				success = getEditorAndFocusOrDisable();

				if (success) {
					observer.disconnect();
					return;
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
			return () => observer.disconnect();
		}, [getEditorAndFocusOrDisable]);

		return (
			<div className={clsx(styles['p-conversation-messages__editor'])}>
				<div ref={fileListRef} className={clsx(styles['p-conversation-messages__selected-files'])}>
					<TagList
						tags={selectedFiles.map((file, index) => ({
							id: `${file.name}-${index}`,
							label: (
								<>
									<Icon name={IconNamesLight.File} />
									<span>{file.name}</span>
									<span> ({Math.round((file.size / 1024 / 1024) * 100) / 100} MB)</span>
								</>
							),
						}))}
						closeIcon={<Icon name={IconNamesLight.Times} aria-hidden />}
						onTagClosed={(id) => {
							const index = Number.parseInt(String(id).split('-').pop() || '0', 10);
							setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
						}}
						variants={['closable', 'silver']}
					/>
				</div>
				<RichTextEditorWithInternalState
					braft={{
						contentStyle: {
							minHeight: '100px',
							maxHeight: '150px',
							overflowY: 'auto',
						},
						// @ts-expect-error: This method does exists on the braft editor so ts-ignoring this to get the error gone
						keyBindingFn: (evt: KeyboardEvent) => {
							if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) {
								// In case of these buttons being pressed, we will allow the enter to go through
								// Otherwise it will be impossible to get more than 1 entry in a list
								return;
							}

							if (keysEnter.includes(evt.key)) {
								handleSendMessage();
							}
						},
					}}
					disabled={inputDisabled}
					className={
						inputDisabled ? styles['p-conversation-messages__editor--disabled'] : undefined
					}
					id={editorId}
					value={currentMessage}
					onChange={(value) => setCurrentMessage(value)}
					placeholder={tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___typ-je-bericht'
					)}
					controls={[
						'bold',
						'italic',
						'underline',
						'list-ul',
						'list-ol',
						'link',
						{
							type: 'customButton',
							component: (
								<MessageFileUpload
									selectedFiles={selectedFiles}
									onFileSelected={(file) => setSelectedFiles((prev) => [...prev, file])}
									disabled={isMaterialRequestClosed(materialRequest)}
								/>
							),
						},
					]}
					key={editorKey}
				/>
				<Button
					id="material-request-conversation__send-button"
					className={clsx(styles['p-conversation-messages__editor__send-button'])}
					variants={['text']}
					// Replace this icon with a send icon when Jelle and JN add the icons to the font
					icon={isSending ? <Spinner /> : <Icon name={IconNamesLight.PaperPlane} />}
					disabled={sendMessageDisabled}
					tabIndex={sendMessageDisabled ? -1 : undefined}
					onClick={handleSendMessage}
				/>
			</div>
		);
	}
);

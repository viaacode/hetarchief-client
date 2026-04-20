import { useGetMaterialRequestConversationInfinite } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestConversationInfinite';
import { useSendMaterialRequestMessage } from '@account/components/MaterialRequestDetailBlade/hooks/useSendMaterialRequestMessage';
import { MaterialRequestConversationMessage } from '@account/components/MaterialRequestDetailBlade/MaterialRequestConversationMessage';
import { isMaterialRequestClosed } from '@account/utils/is-material-request-closed';
import { selectCommonUser } from '@auth/store/user';
import { type MaterialRequest, MaterialRequestStatus } from '@material-requests/types';
import {
	Button,
	keysEnter,
	RichTextEditorWithInternalState,
	TagList,
} from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import { noop } from 'lodash-es';
import React, {
	type FC,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import styles from './MaterialRequestConversation.module.scss';
import { MessageFileUpload } from './MessageFileUpload';

const MATERIAL_REQUEST_CONVERSATION_PAGE_SIZE = 20;

interface MaterialRequestConversationProps {
	materialRequest: MaterialRequest;
	handleDownload: () => void;
	onMessagesLoaded: () => void;
}

export const MaterialRequestConversation: FC<MaterialRequestConversationProps> = ({
	materialRequest,
	handleDownload,
	onMessagesLoaded,
}) => {
	const scrollableRef = useRef<HTMLDivElement>(null);
	const scrollTriggerRef = useRef<HTMLDivElement>(null);
	const fileListRef = useRef<HTMLDivElement>(null);
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const [hasNotified, setHasNotified] = useState(false);
	const previousScrollHeightRef = useRef<number | null>(null);
	const user = useSelector(selectCommonUser);
	const [editorKey, setEditorKey] = useState(uuid()); // To force rich text editor to rerender

	const [currentMessage, setCurrentMessage] = useState<string>('');
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const {
		data: messages,
		isLoading: isLoadingMessages,
		isFetching: isFetchingMessages,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch: refetchMessages,
	} = useGetMaterialRequestConversationInfinite(
		materialRequest.id,
		MATERIAL_REQUEST_CONVERSATION_PAGE_SIZE
	);

	const { mutate: sendMessage, isPending: isSending } = useSendMaterialRequestMessage(
		materialRequest.id
	);

	const isMessageEmpty = useMemo(() => {
		const textContent = currentMessage.replace(/<[^>]*>/g, '').trim();
		return !textContent;
	}, [currentMessage]);

	const sendMessageDisabled = useMemo(
		() =>
			(isMessageEmpty && selectedFiles.length === 0) ||
			isSending ||
			isMaterialRequestClosed(materialRequest),
		[isMessageEmpty, selectedFiles.length, isSending, materialRequest]
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
					scrollableRef.current?.scrollTo({
						top: Number.MAX_SAFE_INTEGER, // scroll all the way to the bottom
					});
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

	// Refetch the messages when the material request gets closed while viewing the conversation to get the latest messages and reflect the closed status in the UI
	useEffect(() => {
		if (
			materialRequest.status === MaterialRequestStatus.CANCELLED ||
			materialRequest.status === MaterialRequestStatus.DENIED
		) {
			refetchMessages().then(noop);
		}
	}, [materialRequest.status, refetchMessages]);

	/**
	 * Scrolls to the bottom of the messages once at page load after the first messages have been loaded.
	 */
	useEffect(() => {
		if (
			!hasScrolledToBottom &&
			(messages?.pages?.[0]?.items || []).length &&
			scrollableRef.current
		) {
			scrollableRef.current.scrollTo({
				top: Number.MAX_SAFE_INTEGER, // scroll all the way to the bottom
			});
			setHasScrolledToBottom(true);
		}
	}, [messages, hasScrolledToBottom]);

	/**
	 * Notifies that the messages were loaded
	 */
	useEffect(() => {
		if (!isFetchingMessages && !hasNotified) {
			onMessagesLoaded();
			setHasNotified(true);
		}
	}, [isFetchingMessages, hasNotified, onMessagesLoaded]);

	// Capture scrollHeight before every render so useLayoutEffect can correct after any page append
	const pageCount = messages?.pages?.length ?? 0;
	if (scrollableRef.current && hasScrolledToBottom) {
		previousScrollHeightRef.current = scrollableRef.current.scrollHeight;
	}

	/**
	 * Preserve scroll position after older messages are prepended.
	 * Runs synchronously after DOM mutation but before paint.
	 */

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to trigger this effect when the number of pages changes
	useLayoutEffect(() => {
		const container = scrollableRef.current;
		if (container && previousScrollHeightRef.current !== null) {
			const newScrollHeight = container.scrollHeight;
			container.scrollTop += newScrollHeight - previousScrollHeightRef.current;
			previousScrollHeightRef.current = null;
		}
	}, [pageCount]);

	/**
	 * IntersectionObserver on a scroll-trigger element at the top of the message list.
	 * When the scroll-trigger becomes visible, fetch the next page.
	 */
	const handleLoadMore = useCallback(() => {
		if (!hasNextPage || isFetchingNextPage || !hasScrolledToBottom) {
			return;
		}
		fetchNextPage().then(() => {
			// Prefetch one extra page ahead so the user never hits the top
			if (hasNextPage) {
				fetchNextPage().then(noop);
			}
		});
	}, [hasNextPage, isFetchingNextPage, hasScrolledToBottom, fetchNextPage]);

	useEffect(() => {
		const sentinel = scrollTriggerRef.current;
		const container = scrollableRef.current;
		if (!sentinel || !container) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasScrolledToBottom) {
					handleLoadMore();
				}
			},
			{ root: container, rootMargin: '500px 0px 0px 0px', threshold: 0 }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [handleLoadMore, hasScrolledToBottom]);

	const renderContent = () => {
		if (isLoadingMessages) {
			return (
				<div className={clsx(styles['p-conversation-messages__loading'])}>
					<Loading fullscreen locationId="ContentPageLabelsOverviewPage" />
				</div>
			);
		}
		return (
			<>
				<div
					className={clsx(styles['p-conversation-messages__message-wrapper'])}
					ref={scrollableRef}
				>
					<div ref={scrollTriggerRef} />
					{isFetchingNextPage && (
						<div className={clsx(styles['p-conversation-messages__loading-more'])}>
							<Loading fullscreen={false} locationId="ConversationLoadMore" />
						</div>
					)}

					{!isFetchingNextPage && !hasNextPage && (
						<div className={clsx(styles['p-conversation-messages__empty-state'])}>
							{materialRequest.requesterId === user?.profileId ? (
								<div className={clsx(styles['p-conversation-messages__empty-state__text'])}>
									{tHtml(
										'modules/account/components/material-request-detail-blade/material-request-conversation___je-hebt-een-nieuwe-aanvraag-tot-hergebruik-verstuurd-naar-name-start-hieronder-je-conversatie',
										{ name: materialRequest.maintainerName }
									)}
								</div>
							) : (
								<div className={clsx(styles['p-conversation-messages__empty-state__text'])}>
									{tHtml(
										'modules/account/components/material-request-detail-blade/material-request-conversation___je-hebt-een-nieuwe-aanvraag-tot-hergebruik-ontvangen-van-name-start-hieronder-je-conversatie',
										{
											name:
												materialRequest.requesterOrganisation || materialRequest.requesterFullName,
										}
									)}
								</div>
							)}
						</div>
					)}

					{[...(messages?.pages || [])].reverse().map((page) => {
						return [...page.items]
							.reverse()
							.map((message) => (
								<MaterialRequestConversationMessage
									key={`p-conversation-messages__${message.id}`}
									message={message}
									materialRequest={materialRequest}
									handleDownload={handleDownload}
								/>
							));
					})}
				</div>
				<div className={clsx(styles['p-conversation-messages__editor'])}>
					<div
						ref={fileListRef}
						className={clsx(styles['p-conversation-messages__selected-files'])}
					>
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
						disabled={isMaterialRequestClosed(materialRequest)}
						className={
							isMaterialRequestClosed(materialRequest)
								? styles['p-conversation-messages__editor--disabled']
								: undefined
						}
						id={`material-request-conversation--${editorKey}`}
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
						icon={<Icon name={IconNamesLight.Email} />}
						disabled={sendMessageDisabled}
						tabIndex={sendMessageDisabled ? -1 : undefined}
						onClick={handleSendMessage}
					/>
				</div>
			</>
		);
	};

	return (
		<div
			className={clsx(
				'p-material-request-detail__conversation',
				styles['p-material-request-detail__conversation']
			)}
		>
			{renderContent()}
		</div>
	);
};

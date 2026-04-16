import { useGetMaterialRequestConversationInfinite } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestConversationInfinite';
import { useSendMaterialRequestMessage } from '@account/components/MaterialRequestDetailBlade/hooks/useSendMaterialRequestMessage';
import { MessageFileUpload } from '@account/components/MaterialRequestDetailBlade/MessageFileUpload';
import { determineHasDownloadExpired } from '@account/utils/handle-download-material-request';
import { isMaterialRequestClosed } from '@account/utils/is-material-request-closed';
import { selectCommonUser } from '@auth/store/user';
import {
	type MaterialRequest,
	MaterialRequestEventType,
	type MaterialRequestMessage,
	type MaterialRequestMessageBodyMessage,
	type MaterialRequestMessageBodyStatusUpdateWithMotivation,
} from '@material-requests/types';
import { Button, keysEnter, RichTextEditorWithInternalState } from '@meemoo/react-components';
import Html from '@shared/components/Html/Html';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { asDate, formatLongDate, formatMediumDateWithTime } from '@shared/utils/dates';
import clsx from 'clsx';
import { format } from 'date-fns';
import Link from 'next/link';
import React, {
	type FC,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import styles from './MaterialRequestConversation.module.scss';

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
	} = useGetMaterialRequestConversationInfinite(
		materialRequest.id,
		MATERIAL_REQUEST_CONVERSATION_PAGE_SIZE
	);

	const { mutate: sendMessage, isPending: isSending } = useSendMaterialRequestMessage(
		materialRequest.id
	);

	const handleSendMessage = useCallback(() => {
		if (!currentMessage.trim() && selectedFiles.length === 0) {
			return;
		}

		// Send single message with text and all selected files
		sendMessage(
			{ message: currentMessage, files: selectedFiles.length > 0 ? selectedFiles : undefined },
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
	}, [currentMessage, selectedFiles, sendMessage]);

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
				fetchNextPage();
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

	/**
	 * Add padding to message wrapper based on file list height to prevent overlap
	 */
	useEffect(() => {
		const fileList = fileListRef.current;
		const messageWrapper = scrollableRef.current;

		if (!messageWrapper) {
			return;
		}

		if (fileList && selectedFiles.length > 0) {
			const fileListHeight = fileList.offsetHeight;
			messageWrapper.style.paddingBottom = `${fileListHeight}px`;
		} else {
			messageWrapper.style.paddingBottom = '';
		}
	}, [selectedFiles]);

	/**
	 * Determines if the message is rendered
	 * - on the right in green (own)
	 * - on the left in grey (other)
	 */
	const isOwnMessage = (message: MaterialRequestMessage): boolean => {
		return message.senderProfile.id === user?.profileId;
	};

	const renderOrganisationName = (message: MaterialRequestMessage) => {
		if (message.senderProfile.organisation?.name) {
			return `${message.senderProfile.organisation?.name} (${message.senderProfile.firstName})`;
		} else {
			return `${message.senderProfile.firstName} ${message.senderProfile.lastName}`;
		}
	};

	const renderMessageWrapper = (message: MaterialRequestMessage, content: ReactNode): ReactNode => {
		const isFinalMessage = [
			MaterialRequestEventType.CANCELLED,
			MaterialRequestEventType.DENIED,
			MaterialRequestEventType.APPROVED,
			MaterialRequestEventType.DOWNLOAD_EXPIRED,
		].includes(message.messageType);

		const isSystemMessage = message.messageType !== MaterialRequestEventType.MESSAGE;

		return (
			<div
				className={clsx(
					styles['p-conversation-messages__message'],
					styles[`p-conversation-messages__message--${message.messageType}`],
					isOwnMessage(message)
						? styles[`p-conversation-messages__message--own`]
						: styles[`p-conversation-messages__message--other`],
					isFinalMessage && styles['p-conversation-messages__message--final'],
					isSystemMessage && styles['p-conversation-messages__message--system']
				)}
			>
				<div className={clsx(styles['p-conversation-messages__message__sender'])}>
					{renderOrganisationName(message)}
				</div>
				<div>{format(message.createdAt, 'dd MMM yyyy, HH:mm')}</div>
				{content}
				{message.attachmentUrl && (
					<Link href={message.attachmentUrl} target="_blank" passHref>
						<div className={clsx(styles['p-conversation-messages__message__attachment'])}>
							<Icon name={IconNamesLight.File}></Icon>
							<span>{message.attachmentFilename}</span>
						</div>
					</Link>
				)}
			</div>
		);
	};

	const renderMessage = (message: MaterialRequestMessage): ReactNode => {
		// TODO(Senn): add messages for additional conditions when implemented
		switch (message.messageType) {
			case MaterialRequestEventType.MESSAGE:
				return renderMessageWrapper(
					message,
					message.body && (
						<Html
							type={'div'}
							className={clsx(styles['p-conversation-messages__message__body'])}
							content={(message.body as MaterialRequestMessageBodyMessage).message}
						/>
					)
				);

			case MaterialRequestEventType.CANCELLED:
				return renderMessageWrapper(
					message,
					<div className={clsx(styles['p-conversation-messages__message__body'])}>
						{tText('{{name}} annuleerde de aanvraag.', {
							name:
								message.senderProfile.organisation?.name ||
								`${message.senderProfile.firstName} ${message.senderProfile.lastName}`,
						})}
					</div>
				);

			case MaterialRequestEventType.DENIED:
				return renderMessageWrapper(
					message,
					<div className={clsx(styles['p-conversation-messages__message__body'])}>
						{(message.body as MaterialRequestMessageBodyStatusUpdateWithMotivation)?.motivation ? (
							<>
								<div>
									{tText('{{name}} keurde de aanvraag af met de volgende boodschap:', {
										name:
											message.senderProfile.organisation?.name ||
											`${message.senderProfile.firstName} ${message.senderProfile.lastName}`,
									})}
								</div>

								<div
									className={clsx(
										styles['p-conversation-messages__message__body--status-motivation']
									)}
								>
									{
										(message.body as MaterialRequestMessageBodyStatusUpdateWithMotivation)
											.motivation
									}
								</div>
							</>
						) : (
							<div>
								{tText('{{name}} keurde de aanvraag af.', {
									name:
										message.senderProfile.organisation?.name ||
										`${message.senderProfile.firstName} ${message.senderProfile.lastName}`,
								})}
							</div>
						)}
					</div>
				);

			case MaterialRequestEventType.APPROVED: {
				const motivation = (message.body as MaterialRequestMessageBodyStatusUpdateWithMotivation)
					?.motivation;
				return renderMessageWrapper(
					message,
					<div className={clsx(styles['p-conversation-messages__message__body'])}>
						{motivation ? (
							<>
								<div>
									{tText('{{name}} keurde de aanvraag goed met de volgende boodschap:', {
										name:
											message.senderProfile.organisation?.name ||
											`${message.senderProfile.firstName} ${message.senderProfile.lastName}`,
									})}
								</div>
								<div
									className={clsx(
										styles['p-conversation-messages__message__body--status-motivation']
									)}
								>
									{motivation}
								</div>
							</>
						) : (
							<div>
								{tText('{{name}} keurde de aanvraag goed.', {
									name:
										message.senderProfile.organisation?.name ||
										`${message.senderProfile.firstName} ${message.senderProfile.lastName}`,
								})}
							</div>
						)}
					</div>
				);
			}

			case MaterialRequestEventType.DOWNLOAD_EXPIRED:
				return renderMessageWrapper(
					message,
					<>
						<div
							className={clsx(styles['p-conversation-messages__message__body--download-expired'])}
						>
							{tText('Download is verlopen', {
								date: formatMediumDateWithTime(asDate(message.createdAt)),
							})}
							.
						</div>
						<div
							className={clsx(
								styles['p-conversation-messages__message__body--download-expired-subtext']
							)}
						>
							{tText('De download is niet langer beschikbaar, dus deze aanvraag wordt afgesloten.')}
						</div>
					</>
				);

			case MaterialRequestEventType.DOWNLOAD_AVAILABLE:
				return renderMessageWrapper(
					message,
					<>
						<div className={clsx(styles['p-conversation-messages__message__body'])}>
							{tText('Het aangevraagde materiaal is beschikbaar voor download')}
						</div>
						<Button
							label={tText(
								'modules/account/components/material-request-detail-blade/material-request-detail-blade___downlooad-materiaal'
							)}
							variants={['dark']}
							onClick={handleDownload}
							className={clsx(styles['p-conversation-messages__message__download-button'])}
							disabled={determineHasDownloadExpired(materialRequest)}
						/>
						<div className={clsx(styles['p-conversation-messages__message__download-expiration'])}>
							<Icon name={IconNamesLight.Info} />
							<span>
								{tText('De download is beschikbaar tot en met', {
									date: formatLongDate(asDate(materialRequest.downloadExpiresAt)),
								})}
							</span>
						</div>
					</>
				);
		}
	};

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
										'Je hebt een nieuwe aanvraag tot hergebruik verstuurd naar {{name}}. Start hieronder je conversatie.',
										{ name: materialRequest.maintainerName }
									)}
								</div>
							) : (
								<div className={clsx(styles['p-conversation-messages__empty-state__text'])}>
									{tHtml(
										'Je hebt een nieuwe aanvraag tot hergebruik ontvangen van {{name}}. Start hieronder je conversatie.',
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
						return [...page.items].reverse().map(renderMessage);
					})}
				</div>
				<div className={clsx(styles['p-conversation-messages__editor'])}>
					<div
						ref={fileListRef}
						className={clsx(styles['p-conversation-messages__selected-files'], {
							[styles['p-conversation-messages__selected-files--hidden']]:
								selectedFiles.length === 0,
						})}
					>
						{selectedFiles.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className={clsx(styles['p-conversation-messages__file-item'])}
							>
								<div className={clsx(styles['p-conversation-messages__file-item__info'])}>
									<Icon name={IconNamesLight.File} />
									<span>{file.name}</span>
									<span>({Math.round((file.size / 1024 / 1024) * 100) / 100} MB)</span>
								</div>
								<button
									type="button"
									className={clsx(styles['p-conversation-messages__file-item__remove'])}
									onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
									aria-label={`Verwijder ${file.name}`}
								>
									<Icon name={IconNamesLight.Times} />
								</button>
							</div>
						))}
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
						disabled={
							(!currentMessage.length && selectedFiles.length === 0) ||
							isSending ||
							isMaterialRequestClosed(materialRequest)
						}
						tabIndex={!currentMessage.length && selectedFiles.length === 0 ? undefined : -1}
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

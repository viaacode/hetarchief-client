import { useGetMaterialRequestConversationInfinite } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestConversationInfinite';
import { useSendMaterialRequestMessage } from '@account/components/MaterialRequestDetailBlade/hooks/useSendMaterialRequestMessage';
import {
	determineHasDownloadExpired,
	handleDownloadMaterialRequest,
} from '@account/utils/handle-download-material-request';
import { isMaterialRequestClosed } from '@account/utils/is-material-request-closed';
import { selectCommonUser } from '@auth/store/user';
import {
	type MaterialRequest,
	MaterialRequestEventType,
	type MaterialRequestMessage,
	type MaterialRequestMessageBodyMessage,
	type MaterialRequestMessageBodyStatusUpdateWithMotivation,
	MaterialRequestStatus,
} from '@material-requests/types';
import { Button, RichTextEditorWithInternalState } from '@meemoo/react-components';
import Html from '@shared/components/Html/Html';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { tText } from '@shared/helpers/translate';
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
}

export const MaterialRequestConversation: FC<MaterialRequestConversationProps> = ({
	materialRequest,
}) => {
	const scrollableRef = useRef<HTMLDivElement>(null);
	const scrollTriggerRef = useRef<HTMLDivElement>(null);
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const previousScrollHeightRef = useRef<number | null>(null);
	const user = useSelector(selectCommonUser);
	const [editorKey, setEditorKey] = useState(uuid()); // To force rich text editor to rerender

	const [currentMessage, setCurrentMessage] = useState<string>('');
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

	const {
		data: messages,
		isLoading: isLoadingMessages,
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
		if (!currentMessage.trim()) {
			return;
		}
		sendMessage(currentMessage, {
			onSuccess: () => {
				setCurrentMessage('');
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
		});
	}, [currentMessage, sendMessage]);

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
							onClick={() => handleDownloadMaterialRequest(materialRequest).then(setDownloadUrl)}
							className={clsx(styles['p-conversation-messages__message__download-button'])}
							disabled={determineHasDownloadExpired(materialRequest)}
						/>
						<div className={clsx(styles['p-conversation-messages__message__download-expiration'])}>
							<Icon name={IconNamesLight.Info} />{' '}
							{tText('De download is beschikbaar tot en met', {
								date: formatLongDate(asDate(materialRequest.downloadExpiresAt)),
							})}
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
									{tText(
										'Je hebt een nieuwe aanvraag tot hergebruik verstuurd naar {{name}}. Start hieronder je conversatie.',
										{ name: materialRequest.maintainerName }
									)}
								</div>
							) : (
								<div className={clsx(styles['p-conversation-messages__empty-state__text'])}>
									{tText(
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
					<RichTextEditorWithInternalState
						braft={{
							contentStyle: {
								minHeight: '100px',
								maxHeight: '150px',
								overflowY: 'auto',
							},
						}}
						disabled={isMaterialRequestClosed(materialRequest)}
						className={isMaterialRequestClosed(materialRequest) ? 'disabled' : undefined}
						id={`material-request-conversation--${editorKey}`}
						value={currentMessage}
						onChange={(value) => setCurrentMessage(value)}
						placeholder={tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___typ-je-bericht'
						)}
						controls={['bold', 'italic', 'underline', 'list-ul', 'list-ol', 'link']}
						key={editorKey}
					/>
					<Button
						id="material-request-conversation__send-button"
						className={clsx(styles['p-conversation-messages__editor__send-button'])}
						variants={['text']}
						// Replace this icon with a send icon when Jelle and JN add the icons to the font
						icon={<Icon name={IconNamesLight.Email} />}
						disabled={
							!currentMessage.length || isSending || isMaterialRequestClosed(materialRequest)
						}
						tabIndex={!currentMessage.length ? undefined : -1}
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

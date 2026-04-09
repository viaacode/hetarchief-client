import { useGetMaterialRequestConversationInfinite } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestConversationInfinite';
import { useSendMaterialRequestMessage } from '@account/components/MaterialRequestDetailBlade/hooks/useSendMaterialRequestMessage';
import {
	Lookup_App_Material_Request_Message_Type_Enum,
	type MaterialRequestMessage,
} from '@account/components/MaterialRequestDetailBlade/MaterialRequestConversation.types';
import { selectCommonUser } from '@auth/store/user';
import type { MaterialRequest, MaterialRequestMessageBodyMessage } from '@material-requests/types';
import { Button, RichTextEditorWithInternalState } from '@meemoo/react-components';
import Html from '@shared/components/Html/Html';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
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

	const [currentMessage, setCurrentMessage] = useState<string>('');

	const { mutate: sendMessage, isPending: isSending } = useSendMaterialRequestMessage(
		materialRequest.id
	);

	const handleSendMessage = useCallback(() => {
		if (!currentMessage.trim()) return;
		sendMessage(currentMessage, {
			onSuccess: () => {
				setCurrentMessage('');
			},
			onError: () => {
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
				top: 100000000, // bottom
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
		if (!hasNextPage || isFetchingNextPage || !hasScrolledToBottom) return;
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
		if (!sentinel || !container) return;

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

	const renderMessage = (message: MaterialRequestMessage): ReactNode => {
		switch (message.messageType) {
			case Lookup_App_Material_Request_Message_Type_Enum.Message:
				return (
					<div
						className={clsx(
							styles['p-conversation-messages__message'],
							styles[`p-conversation-messages__message--${message.messageType}`],
							isOwnMessage(message)
								? styles[`p-conversation-messages__message--own`]
								: styles[`p-conversation-messages__message--other`]
						)}
					>
						<div className={clsx(styles['p-conversation-messages__message__sender'])}>
							{renderOrganisationName(message)}
						</div>
						<div>{format(message.createdAt, 'dd MMM yyyy, HH:mm')}</div>
						{!!message.body && (
							<Html
								type={'div'}
								className={clsx(styles['p-conversation-messages__message__body'])}
								content={(message.body as MaterialRequestMessageBodyMessage).message}
							/>
						)}
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
			<div>
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
							draftProps: {
								ariaDescribedBy: 'material-request-conversation__description',
								ariaLabelledBy: 'material-request-conversation__label',
								handleKeyCommand: (command: string) => {
									if (command === 'send-message') {
										handleSendMessage();
										return 'handled';
									}
									return 'not-handled';
								},
								keyBindingFn: (e: React.KeyboardEvent) => {
									if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
										return 'send-message';
									}
									return undefined;
								},
							},
						}}
						id="material-request-conversation"
						value={currentMessage}
						onChange={(value) => setCurrentMessage(value)}
						placeholder={tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___typ-je-bericht'
						)}
						controls={['bold', 'italic', 'underline', 'list-ul', 'list-ol', 'link']}
					/>
					<Button
						id="material-request-conversation__send-button"
						className={clsx(styles['p-conversation-messages__editor__send-button'])}
						variants={['text']}
						icon={<Icon name={IconNamesLight.Email} />}
						disabled={!currentMessage.length || isSending}
						tabIndex={!currentMessage.length ? undefined : -1}
						onClick={handleSendMessage}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className={clsx(styles['p-material-request-detail__conversation'])}>{renderContent()}</div>
	);
};

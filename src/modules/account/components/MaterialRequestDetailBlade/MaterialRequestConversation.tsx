import { useGetMaterialRequestConversationInfinite } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestConversationInfinite';
import { MaterialRequestConversationInput } from '@account/components/MaterialRequestDetailBlade/MaterialRequestConversationInput';
import { MaterialRequestConversationMessage } from '@account/components/MaterialRequestDetailBlade/MaterialRequestConversationMessage';
import { selectCommonUser } from '@auth/store/user';
import type { MaterialRequest } from '@material-requests/types';
import { Loading } from '@shared/components/Loading';
import { tHtml } from '@shared/helpers/translate';
import clsx from 'clsx';
import { noop } from 'lodash-es';
import React, { type FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const [hasNotified, setHasNotified] = useState(false);
	const previousScrollHeightRef = useRef<number | null>(null);
	const user = useSelector(selectCommonUser);

	const [fileListHeight, setFileListHeight] = useState<number>(0);

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

	/**
	 * Scrolls to the bottom of the messages once at page load after the first messages have been loaded.
	 * And after every message that has been send
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: We only want to scroll when the message count changes of the first page
	useEffect(() => {
		if ((messages?.pages?.[0]?.items || []).length && scrollableRef.current) {
			scrollableRef.current.scrollTo({
				top: Number.MAX_SAFE_INTEGER, // scroll all the way to the bottom
				behavior: hasScrolledToBottom ? 'smooth' : 'instant',
			});
			setHasScrolledToBottom(true);
		}
	}, [messages?.pages?.[0]?.items]);

	/**
	 * Notifies that the messages were loaded
	 */
	useEffect(() => {
		if (!isFetchingMessages && !hasNotified) {
			onMessagesLoaded();
			setHasNotified(true);
		}
	}, [isFetchingMessages, hasNotified, onMessagesLoaded]);

	// Capture scrollHeight before every render so useLayoutEffect can correct after every page that is appended to the dom
	const pageCount = messages?.pages?.length ?? 0;
	if (scrollableRef.current && hasScrolledToBottom) {
		previousScrollHeightRef.current = scrollableRef.current.scrollHeight;
	}

	/**
	 * Preserve scroll-position after older messages are prepended.
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
					style={{
						paddingBottom: fileListHeight > 0 ? `${fileListHeight}px` : undefined,
					}}
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
				<MaterialRequestConversationInput
					key={materialRequest.id}
					materialRequest={materialRequest}
					onAttachmentsChanged={setFileListHeight}
				/>
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

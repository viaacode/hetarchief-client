import { determineHasDownloadExpired } from '@account/utils/handle-download-material-request';
import { selectCommonUser } from '@auth/store/user';
import {
	type MaterialRequest,
	MaterialRequestEventType,
	type MaterialRequestMessage,
	type MaterialRequestMessageBodyMessage,
	type MaterialRequestMessageBodyStatusUpdateWithMotivation,
} from '@material-requests/types';
import { Button } from '@meemoo/react-components';
import Html from '@shared/components/Html/Html';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { asDate, formatLongDate, formatMediumDateWithTime } from '@shared/utils/dates';
import clsx from 'clsx';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { type FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './MaterialRequestConversation.module.scss';

interface MaterialRequestConversationMessageProps {
	message: MaterialRequestMessage;
	materialRequest: MaterialRequest;
	handleDownload: () => void;
}

export const MaterialRequestConversationMessage: FC<MaterialRequestConversationMessageProps> = ({
	message,
	materialRequest,
	handleDownload,
}) => {
	const user = useSelector(selectCommonUser);

	/**
	 * Determines if the message is rendered
	 * - on the right in green (own)
	 * - on the left in grey (other)
	 */
	const isOwnMessage = message.senderProfile.id === user?.profileId;

	// Cancelled, denied and download expired are all closable events. Final summary will always be added after that
	const isFinalMessage = [
		MaterialRequestEventType.CANCELLED,
		MaterialRequestEventType.DENIED,
		MaterialRequestEventType.DOWNLOAD_EXPIRED,
		MaterialRequestEventType.FINAL_SUMMARY,
	].includes(message.messageType);

	// We want the reuse summary seem like it was send from the requester
	const isSystemMessage =
		message.messageType !== MaterialRequestEventType.MESSAGE &&
		message.messageType !== MaterialRequestEventType.REUSE_SUMMARY;

	const senderName =
		message.senderProfile.organisation?.name ||
		`${message.senderProfile.firstName} ${message.senderProfile.lastName}`;

	const renderOrganisationName = () => {
		if (message.senderProfile.organisation?.name) {
			return `${message.senderProfile.organisation?.name} (${message.senderProfile.firstName})`;
		} else {
			return `${message.senderProfile.firstName} ${message.senderProfile.lastName}`;
		}
	};

	const renderMessageBody = () => {
		return (
			<Html
				type={'div'}
				className={clsx(styles['p-conversation-messages__message__body'])}
				content={(message.body as MaterialRequestMessageBodyMessage).message}
			/>
		);
	};

	const renderCancelled = () => {
		return (
			<div className={clsx(styles['p-conversation-messages__message__body'])}>
				{tHtml(
					'modules/account/components/material-request-detail-blade/material-request-conversation___name-annuleerde-de-aanvraag',
					{
						name: senderName,
					}
				)}
			</div>
		);
	};

	const renderDownloadAvailable = () => {
		return (
			<>
				<div className={clsx(styles['p-conversation-messages__message__body'])}>
					{tHtml(
						'modules/account/components/material-request-detail-blade/material-request-conversation___het-aangevraagde-materiaal-is-beschikbaar-voor-download'
					)}
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
						{tHtml(
							'modules/account/components/material-request-detail-blade/material-request-conversation___de-download-is-beschikbaar-tot-en-met',
							{
								date: formatLongDate(asDate(materialRequest.downloadExpiresAt)),
							}
						)}
					</span>
				</div>
			</>
		);
	};

	const renderDownloadExpired = () => {
		return (
			<>
				<div className={clsx(styles['p-conversation-messages__message__body--download-expired'])}>
					{tHtml(
						'modules/account/components/material-request-detail-blade/material-request-conversation___download-is-verlopen',
						{
							date: formatMediumDateWithTime(asDate(message.createdAt)),
						}
					)}
				</div>
				<div
					className={clsx(
						styles['p-conversation-messages__message__body--download-expired-subtext']
					)}
				>
					{tHtml(
						'modules/account/components/material-request-detail-blade/material-request-conversation___de-download-is-niet-langer-beschikbaar-dus-deze-aanvraag-wordt-afgesloten'
					)}
				</div>
			</>
		);
	};

	const renderStatusUpdate = () => {
		const motivation = (message.body as MaterialRequestMessageBodyStatusUpdateWithMotivation)
			?.motivation;

		const isApproved = message.messageType === MaterialRequestEventType.APPROVED;
		let title: React.ReactNode;

		if (motivation) {
			if (isApproved) {
				title = tHtml(
					'modules/account/components/material-request-detail-blade/material-request-conversation___name-keurde-de-aanvraag-goed-met-de-volgende-boodschap',
					{
						name: senderName,
					}
				);
			} else {
				title = tHtml(
					'modules/account/components/material-request-detail-blade/material-request-conversation___name-keurde-de-aanvraag-af-met-de-volgende-boodschap',
					{
						name: senderName,
					}
				);
			}

			return (
				<div className={clsx(styles['p-conversation-messages__message__body'])}>
					<div>{title}</div>
					<div
						className={clsx(styles['p-conversation-messages__message__body--status-motivation'])}
					>
						{motivation}
					</div>
				</div>
			);
		}

		if (isApproved) {
			title = tHtml(
				'modules/account/components/material-request-detail-blade/material-request-conversation___name-keurde-de-aanvraag-goed',
				{
					name: senderName,
				}
			);
		} else {
			title = tHtml(
				'modules/account/components/material-request-detail-blade/material-request-conversation___name-keurde-de-aanvraag-af',
				{
					name: senderName,
				}
			);
		}
		return <div className={clsx(styles['p-conversation-messages__message__body'])}>{title}</div>;
	};

	const renderMessageContent = () => {
		switch (message.messageType) {
			case MaterialRequestEventType.MESSAGE:
				return message.body && renderMessageBody();

			case MaterialRequestEventType.CANCELLED:
				return renderCancelled();

			case MaterialRequestEventType.APPROVED:
			case MaterialRequestEventType.DENIED:
				return renderStatusUpdate();

			case MaterialRequestEventType.DOWNLOAD_EXPIRED:
				return renderDownloadExpired();

			case MaterialRequestEventType.DOWNLOAD_AVAILABLE:
				return renderDownloadAvailable();

			case MaterialRequestEventType.ADDITIONAL_CONDITIONS:
			case MaterialRequestEventType.ADDITIONAL_CONDITIONS_ACCEPTED:
			case MaterialRequestEventType.ADDITIONAL_CONDITIONS_DENIED: {
				return 'TODO: implement these messages';
			}
		}
	};

	const renderMessageHeader = () => {
		// No header for system messages
		if (isSystemMessage) {
			return null;
		}

		return (
			<div className={clsx(styles['p-conversation-messages__message__sender'])}>
				{renderOrganisationName()}
			</div>
		);
	};

	return (
		<div
			className={clsx(
				styles['p-conversation-messages__message'],
				styles[`p-conversation-messages__message--${message.messageType}`],
				isOwnMessage
					? styles[`p-conversation-messages__message--own`]
					: styles[`p-conversation-messages__message--other`],
				isFinalMessage && styles['p-conversation-messages__message--final'],
				isSystemMessage && styles['p-conversation-messages__message--system']
			)}
		>
			{renderMessageHeader()}
			<div>{format(message.createdAt, 'dd MMM yyyy, HH:mm')}</div>
			{renderMessageContent()}
			{message.attachments?.map((attachment) => (
				<Link
					key={`conversation-messages__message__attachment__${attachment.id}`}
					href={attachment.attachmentUrl}
					target="_blank"
					passHref
					className={clsx(styles['p-conversation-messages__message__attachment'])}
				>
					<Icon name={IconNamesLight.File}></Icon>
					{attachment.attachmentFilename}
				</Link>
			))}
		</div>
	);
};

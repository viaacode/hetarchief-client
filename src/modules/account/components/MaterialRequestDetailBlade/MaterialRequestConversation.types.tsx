export enum MaterialRequestAdditionalConditionsType {
	PERMISSION_LICENSE_OWNER = 'PERMISSION_LICENSE_OWNER',
	ATTRIBUTION = 'ATTRIBUTION',
	PAYMENT = 'PAYMENT',
	EXTRA_USE_LIMITATION = 'EXTRA_USE_LIMITATION',
}

export interface MaterialRequestMessageBodyAdditionalCondition {
	type: MaterialRequestAdditionalConditionsType;
	text: string;
}

export interface MaterialRequestMessageBodyMessage {
	message: string;
}

export interface MaterialRequestMessageBodyAdditionalConditions {
	conditions: MaterialRequestMessageBodyAdditionalCondition[];
	autoApproveAfterAcceptAdditionalConditions: boolean;
}

export interface MaterialRequestMessageBodyStatusUpdateWithMotivation {
	motivation: string;
}

export type MaterialRequestMessageBody =
	| MaterialRequestMessageBodyMessage
	| MaterialRequestMessageBodyAdditionalConditions
	| MaterialRequestMessageBodyStatusUpdateWithMotivation;

export enum Lookup_App_Material_Request_Message_Type_Enum {
	/** additional conditions */
	AdditionalConditions = 'ADDITIONAL_CONDITIONS',
	/** requester accepted the additional conditions */
	AdditionalConditionsAccepted = 'ADDITIONAL_CONDITIONS_ACCEPTED',
	/** requester denied the additional conditions */
	AdditionalConditionsDenied = 'ADDITIONAL_CONDITIONS_DENIED',
	/** when a material request is approved by an evaluator at the cp */
	Approved = 'APPROVED',
	/** when a material request is cancelled by the requester */
	Cancelled = 'CANCELLED',
	/** when a material request is denied by an evaluator at the cp */
	Denied = 'DENIED',
	/** When a download is made available */
	DownloadAvailable = 'DOWNLOAD_AVAILABLE',
	/** When a download has expired */
	DownloadExpired = 'DOWNLOAD_EXPIRED',
	/** When a download job has started */
	DownloadRequested = 'DOWNLOAD_REQUESTED',
	/** pdf generated when the material request gets a final status. eg: APPROVED or DENIED or CANCELLED */
	FinalSummary = 'FINAL_SUMMARY',
	/** a regular message */
	Message = 'MESSAGE',
	/** pdf file generated when the requester sends the material request with reuse form to the evaluator */
	ReuseSummary = 'REUSE_SUMMARY',
}

export interface MaterialRequestEvent {
	id: string;
	materialRequestId: string;
	messageType: Lookup_App_Material_Request_Message_Type_Enum;
	body: MaterialRequestMessageBody;
	createdAt: string;
	senderProfile: {
		id: string;
		mail: string;
		firstName: string;
		lastName: string;
		organisation: {
			id: string;
			name: string;
		};
	};
}

export interface MaterialRequestMessage extends MaterialRequestEvent {
	attachmentUrl: string | null;
	attachmentFilename: string | null;
}

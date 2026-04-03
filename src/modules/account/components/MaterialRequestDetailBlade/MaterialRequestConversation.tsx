import { RichTextEditorWithInternalState } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { type FC, useState } from 'react';

const MaterialRequestConversation: FC = () => {
	const [message, setMessage] = useState<string>('<p></p>');

	return (
		<div>
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
					},
				}}
				id="material-request-conversation"
				value={message}
				onChange={(value) => setMessage(value)}
				placeholder={tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___typ-je-bericht'
				)}
				controls={['bold', 'italic', 'underline', 'list-ul', 'list-ol', 'link']}
			/>
		</div>
	);
};

export default MaterialRequestConversation;

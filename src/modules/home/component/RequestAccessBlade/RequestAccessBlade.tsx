import { Button, Checkbox, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { Blade } from '@shared/components';
import { OPTIONAL_LABEL } from '@shared/const';

import { RequestAccessBladeProps } from './RequestAccessBlade.types';

const RequestAccessBlade: FC<RequestAccessBladeProps> = (props) => {
	const { t } = useTranslation();

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-16">
				<Checkbox
					className="u-mb-24"
					label={t(
						'Ik verklaar deze toegang aan te vragen met het oog op onderzoeksdoeleinden of privé studie.'
					)}
				/>
				<Button label={t('Verstuur')} variants={['block', 'black']} />
				<Button
					label={t('Annuleer')}
					variants={['block', 'text']}
					onClick={props.onClose}
				/>
			</div>
		);
	};

	return (
		<Blade {...props} title={t('Vraag toegang aan')} footer={renderFooter()}>
			<div className="u-px-32">
				<form>
					<FormControl className="u-mb-24" label={t('Reden van aanvraag')}>
						<TextArea />
					</FormControl>

					<FormControl
						label={t('Wanneer wil je de leeszaal bezoeken?')}
						suffix={OPTIONAL_LABEL}
					>
						<TextInput />
					</FormControl>
				</form>
			</div>
		</Blade>
	);
};

export default RequestAccessBlade;

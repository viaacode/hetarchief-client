import { Button, FormControl, RichEditorState, RichTextEditor } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { RichTextFormProps, RichTextFormState } from './RichTextForm.types';
import { isEqualHtml } from './RichTextForm.utils';

const RichTextForm: FC<RichTextFormProps> = ({ onSubmit }) => {
	const { t } = useTranslation();

	const { control, handleSubmit, setValue, watch } = useForm<RichTextFormState>();
	const [savedState, setSavedState] = useState<RichEditorState>();

	const onFormSubmit = (state: RichEditorState) => {
		onSubmit?.(state.toHTML());
		setSavedState(state);
	};

	const renderCancelSaveButtons = (onCancel: () => void, onSave: () => void) => (
		<div className="p-cp-settings__cancel-save">
			<Button label={t('Annuleer')} variants="text" onClick={onCancel} />
			<Button label={t('Bewaar wijzigingen')} variants="black" onClick={onSave} />
		</div>
	);

	return (
		<FormControl>
			<Controller
				name="richText"
				control={control}
				render={({ field }) => {
					const currentState = watch('richText');
					return (
						<>
							<RichTextEditor
								onBlur={field.onBlur}
								onChange={(state) => {
									if (!savedState) {
										setSavedState(state);
									}

									setValue('richText', state);
								}}
								initialHtml={'<p><strong>initial HTML</strong></p>'}
								state={currentState}
							/>
							{!isEqualHtml(currentState, savedState) &&
								renderCancelSaveButtons(
									() => setValue('richText', savedState),
									handleSubmit(({ richText }) =>
										onFormSubmit(richText as RichEditorState)
									)
								)}
						</>
					);
				}}
			/>
		</FormControl>
	);
};

export default RichTextForm;

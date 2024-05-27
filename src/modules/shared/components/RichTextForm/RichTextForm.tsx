import { FormControl, RichEditorState, RichTextEditor } from '@meemoo/react-components';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import styles from './RichTextForm.module.scss';
import {
	RICH_TEXT_EDITOR_OPTIONS,
	RichTextFormProps,
	RichTextFormState,
} from './RichTextForm.types';
import { isEqualHtml } from './RichTextForm.utils';

const RichTextForm: FC<RichTextFormProps> = ({
	className,
	formControl,
	editor,
	onSubmit,
	onUpdate,
	renderCancelSaveButtons,
}) => {
	const { control, handleSubmit, setValue, watch } = useForm<RichTextFormState>();
	const [savedState, setSavedState] = useState<RichEditorState>();

	const onFormSubmit = (state: RichEditorState) => {
		onSubmit?.(state.toHTML(), () => setSavedState(state));
	};

	return (
		<FormControl className={className} {...formControl}>
			<Controller
				control={control}
				name="richText"
				render={({ field }) => {
					const currentState = watch('richText');

					return (
						<div className={styles['c-rich-text-form__wrapper']}>
							<RichTextEditor
								controls={RICH_TEXT_EDITOR_OPTIONS}
								className="c-rich-text-editor"
								{...editor}
								onBlur={field.onBlur}
								onChange={(state: RichEditorState) => {
									if (!savedState) {
										setSavedState(state);
									}

									setValue('richText', state);
									onUpdate?.(state.toHTML());
									editor?.onChange?.(state);
								}}
								state={currentState}
								braft={{
									...editor?.braft,
									draftProps: {
										ariaAutoComplete: false,
										ariaMultiline: true,
										...editor?.braft?.draftProps,
									},
								}}
							/>

							{!isEqualHtml(currentState, savedState) &&
								renderCancelSaveButtons(
									() => setValue('richText', savedState),
									handleSubmit(({ richText }) =>
										onFormSubmit(richText as RichEditorState)
									)
								)}
						</div>
					);
				}}
			/>
		</FormControl>
	);
};

export default RichTextForm;

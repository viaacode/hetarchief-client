import { FormControl, RichEditorState } from '@meemoo/react-components';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { RichTextEditor } from '../RichTextEditor';

import styles from './RichTextForm.module.scss';
import { RichTextFormProps, RichTextFormState } from './RichTextForm.types';
import { isEqualHtml } from './RichTextForm.utils';

const RichTextForm: FC<RichTextFormProps> = ({
	className,
	initialHTML,
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
		<FormControl className={className}>
			<Controller
				name="richText"
				control={control}
				render={({ field }) => {
					const currentState = watch('richText');
					return (
						<div className={styles['c-rich-text-form__wrapper']}>
							<RichTextEditor
								onBlur={field.onBlur}
								onChange={(state) => {
									if (!savedState) {
										setSavedState(state);
									}

									setValue('richText', state);
									onUpdate?.(state.toHTML());
								}}
								initialHtml={initialHTML}
								state={currentState}
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

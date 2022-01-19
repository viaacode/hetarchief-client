import { TagInfo, TagsInputProps } from '@meemoo/react-components';
import { ReactNode } from 'react';
import { ActionMeta, OnChangeValue } from 'react-select';

import { DefaultComponentProps } from '@shared/types';

export type SearchBarProps<IsMulti extends boolean = false> = DefaultComponentProps &
	Omit<TagsInputProps<IsMulti>, 'rootClassName' | 'classNamePrefix' | 'variants'> & {
		clearLabel?: SearchBarClearLabel;
		large?: boolean;
		valuePlaceholder?: SearchBarValuePlaceholder;
		onClear?: () => void;
		onSearch?: () => void;
	};

export type SearchBarClearLabel = string | ReactNode;
export type SearchBarValuePlaceholder = string | ReactNode;

export type SearchBarValue<IsMulti extends boolean> = OnChangeValue<TagInfo, IsMulti>;
export type SearchBarMeta = ActionMeta<TagInfo>;

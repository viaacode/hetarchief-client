import { SmartLink } from '@meemoo/admin-core-ui/dist/client.mjs';
import { Button } from '@viaa/avo2-components';
import { compact } from 'lodash-es';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import { GET_TYPE_TO_ICON_MAP } from '@content-page/components/blocks/BlockContentEnclose/BlockContentEnclose.const';
import { Icon, type IconName } from '@shared/components/Icon';

import MediaCard from '../../../../shared/components/MediaCard/MediaCard';

import styles from './BlockContentEnclose.module.scss';
import type { BlockContentEncloseProps, MappedElement } from './BlockContentEnclose.types';
import { useGetContentBlockEncloseContent } from './hooks/useGetContentBlockEncloseContent';
import type { GetContentBlockEncloseContentReturnType } from './hooks/useGetContentBlockEncloseContent.types';

export const BlockContentEnclose: FC<BlockContentEncloseProps> = ({
	title,
	titleType,
	description,
	buttonLabel,
	buttonAction,
	buttonType,
	buttonIcon,
	buttonAltTitle,
	elements,
}) => {
	const elementTypeAndIds: (MappedElement | undefined)[] = useMemo(
		() =>
			compact(
				elements.map((element) => {
					if (!element?.mediaItem?.value) {
						return;
					}
					return {
						value: element.mediaItem.value,
						type: element.mediaItem.type,
					};
				})
			),
		[elements]
	);

	const elementInfos: GetContentBlockEncloseContentReturnType[] = useGetContentBlockEncloseContent(
		elementTypeAndIds as MappedElement[],
		elements
	);

	const getKey = (item: GetContentBlockEncloseContentReturnType, i: number) => {
		let key: string | undefined = item.pid;

		if (key === undefined) {
			if (typeof item.name === 'string') {
				key = `${encodeURIComponent(item.name || 'card')}--${i}`;
			} else {
				key = i.toString();
			}
		}

		return key;
	};

	const HeadingType = titleType;
	return (
		<>
			<div className={styles['c-block-enclosed-content__header']}>
				<div>
					<HeadingType className={`c-heading c-${HeadingType}`}>{title}</HeadingType>
					{description && <p>{description}</p>}
				</div>
				{buttonAction && (
					<SmartLink action={buttonAction}>
						<Button
							label={buttonAltTitle || buttonLabel}
							type={buttonType}
							renderIcon={
								buttonIcon ? () => <Icon name={buttonIcon as unknown as IconName} /> : undefined
							}
						/>
					</SmartLink>
				)}
			</div>
			<ul className={styles['c-block-enclosed-content__cards']}>
				{elementInfos?.map((elementInfo, index) => {
					return (
						<MediaCard
							className={styles['c-block-enclosed-content__card']}
							key={getKey(elementInfo, index)}
							id={getKey(elementInfo, index)}
							objectId={elementInfo.identifier}
							title={elementInfo.name}
							view="grid"
							link={elementInfo.link}
							maintainerSlug={elementInfo.maintainerSlug}
							type={elementInfo.objectType}
							publishedBy={elementInfo.maintainerName}
							name={elementInfo.name}
							description={elementInfo.description}
							publishedOrCreatedDate={elementInfo.datePublished || elementInfo.dateCreated}
							thumbnail={elementInfo.thumbnail}
							icon={
								elementInfo.objectType ? GET_TYPE_TO_ICON_MAP()[elementInfo.objectType] : undefined
							}
						/>
					);
				})}
			</ul>
		</>
	);
};

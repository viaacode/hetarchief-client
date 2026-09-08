import { SmartLink } from '@meemoo/admin-core-ui/client';
import { Icon, type IconName } from '@shared/components/Icon';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { Button } from '@viaa/avo2-components';
import { compact } from 'es-toolkit/compat';
import type { FC } from 'react';
import React, { useMemo } from 'react';

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
						return undefined;
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
					{description && <p className="u-background-text-primary">{description}</p>}
				</div>
				{buttonAction && (
					<SmartLink action={buttonAction}>
						<Button
							label={buttonAltTitle || buttonLabel}
							type={buttonType}
							renderIcon={
								buttonIcon
									? () => <Icon name={buttonIcon as unknown as IconName} aria-hidden />
									: undefined
							}
						/>
					</SmartLink>
				)}
			</div>
			<ul className={styles['c-block-enclosed-content__cards']}>
				{elementInfos?.map((elementInfo, index) => {
					// Content pages are not gated behind essence access, so their image always shows. For
					// ie-objects we only show it when the proxy says so, never by accident.
					const hasAccessToEssence =
						elementInfo.type === 'CONTENT_PAGE' ? true : (elementInfo.hasAccessToEssence ?? false);

					return (
						<li key={getKey(elementInfo, index)}>
							<MediaCard
								className={styles['c-block-enclosed-content__card']}
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
								hasAccessToEssence={hasAccessToEssence}
								// Only ie-objects carry an objectType; a content page gets no type icon at all
								icon={
									elementInfo.objectType
										? getIconFromObjectType(elementInfo.objectType, hasAccessToEssence)
										: null
								}
							/>
						</li>
					);
				})}
			</ul>
		</>
	);
};

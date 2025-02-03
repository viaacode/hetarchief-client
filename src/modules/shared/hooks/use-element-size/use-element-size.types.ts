import type { RefObject } from 'react';

export type UseElementSize = (target: RefObject<HTMLElement>) => DOMRect | undefined;

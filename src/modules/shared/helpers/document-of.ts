import { RenderResult } from '@testing-library/react';

export function documentOf(result: RenderResult): Document {
	return result.container.ownerDocument;
}

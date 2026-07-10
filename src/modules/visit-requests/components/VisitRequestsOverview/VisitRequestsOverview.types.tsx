import type { Column } from '@meemoo/react-components';
import type { VisitRequest } from '@shared/types/visit-request';
import type { ReactNode } from 'react';

export interface VisitRequestOverviewProps {
	children?: ReactNode;
	columns: Column<VisitRequest>[];
}

import type { ReactNode } from 'react';
import type { Column } from 'react-table';

import type { VisitRequest } from '@shared/types/visit-request';

export interface VisitRequestOverviewProps {
	children?: ReactNode;
	columns: Column<VisitRequest>[];
}

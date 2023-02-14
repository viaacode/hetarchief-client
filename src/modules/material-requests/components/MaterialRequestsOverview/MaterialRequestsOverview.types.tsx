import { Column } from 'react-table';

import { MaterialRequest } from 'modules/material-requests/types';

export interface MaterialRequestOverviewProps {
	columns: Column<MaterialRequest>[];
}

export type MaterialRequestRow = { row: { original: MaterialRequest } };

import type { FormBladeProps } from '@shared/types/blade';

import type { ProcessVisitBladeProps } from '../ProcessVisitBlade/ProcessVisitBlade.types';

export type CancelVisitBladeProps = FormBladeProps<Record<string, never>> & ProcessVisitBladeProps;

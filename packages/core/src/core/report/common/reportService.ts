import { createDecorator } from '@/core/instantiation/common';


export interface IReportService {
	report(): void;
}

export const IReportService = createDecorator<IReportService>('IReportService');

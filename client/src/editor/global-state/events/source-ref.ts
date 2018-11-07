import { SourceRefSource, SourceRef } from '@common/models/SourceRef';

export const SELECTED_SOURCE_REF_EVENT = "SELECTED_SOURCE_REF_EVENT";

export interface SelectedSourceRefArgs {
  panelNumber: number;
  catalogNodeId: string;
  ref: SourceRef;
  sourceIndex: number | undefined;
}
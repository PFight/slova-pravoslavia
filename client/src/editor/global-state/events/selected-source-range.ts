import {  SourceRefSource } from '@common/models/SourceRef';

export const SELECTED_SOURCE_RANGE_EVENT = "SELECTED_SOURCE_RANGE";

export interface SelectedSourceRangeArgs {
  panelNumber: number;
  source: SourceRefSource;
}
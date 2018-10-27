import {  SourceRefSource } from '@common/models/SourceRef';

export const SELECTED_SOURCE_RANGE_EVENT = "SELECTED_SOURCE_RANGE";
export const ASSIGN_TO_SELECTED_NODE = "ASSIGN_TO_SELECTED_NODE";
export const ADD_AS_CHILD = "ADD_AS_CHILD";
export const ADD_AS_SIBLING = "ADD_AS_SIBLING";

export interface SelectedSourceRangeArgs {
  panelNumber: number;
  source: SourceRefSource;
}
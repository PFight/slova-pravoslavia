import { SourceFileInfo } from '@common/models/SourceFileInfo';
import { SelectedSourceRangeArgs } from '../../global-state/events/source-range';
import { getNodeId } from './nodeSelector';
export function createSourceRangeEventArgs(panelNumber: number, sourceFile: SourceFileInfo, selection: Selection, header?: string): SelectedSourceRangeArgs {
  return {
    panelNumber,
    header,
    source: {
      language: sourceFile.language,
      format: sourceFile.format,
      ranges: [
        {
          sourceFileId: sourceFile.id,
          beginNodeId: getNodeId(selection.anchorNode),
          beginNodeStartShift: selection.anchorOffset.toString(),
          endNodeId: getNodeId(selection.extentNode),
          endNodeFinishShift: selection.extentOffset.toString()
        }
      ]
    }
  } as SelectedSourceRangeArgs;
}
import { SourceFileInfo } from '@common/models/SourceFileInfo';
import { SelectedSourceRangeArgs } from '../../global-state/events/source-range';
import { getNodeId } from './nodeSelector';
import { CatalogNode } from '@common/models/CatalogNode';
export function createSourceRangeEventArgs(panelNumber: number, sourceFile: SourceFileInfo, selection: Selection, header?: string, catalogNode?: CatalogNode): SelectedSourceRangeArgs {
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
    },
    catalogNode
  } as SelectedSourceRangeArgs;
}
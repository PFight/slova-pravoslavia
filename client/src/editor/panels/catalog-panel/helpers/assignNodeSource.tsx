import { CatalogNode } from '@common/models/CatalogNode';
import { SelectedSourceRangeArgs } from 'editor/global-state/events/source-range';
import { getSourceCaption } from '../../panels-common/getSourceCaption';

export function assignNodeSource(selectedNode: CatalogNode, args: SelectedSourceRangeArgs) {
  if (!selectedNode.data!.sources) {
    selectedNode.data!.sources = [];
  }
  let sources = selectedNode.data!.sources;
  let existingIndex = sources.findIndex(x => x.language == args.source.language && x.format == args.source.format);
  let source = args.source;
  if (!source.caption) { 
    source.caption = getSourceCaption(selectedNode, source);
  }
  if (existingIndex >= 0) {    
    sources[existingIndex] = args.source;    
  }
  else {
    sources.push(args.source);
  }
}

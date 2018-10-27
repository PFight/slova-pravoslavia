import { Alignment, Button, MenuItem, Navbar, NavbarGroup } from '@blueprintjs/core';
import { IItemRendererProps, Select } from "@blueprintjs/select";
import { SourceFileInfo } from '@common/models/SourceFileInfo';
import { debounce } from "debounce";
import * as GoldenLayout from "golden-layout";
import React from "react";
import styled from 'styled-components';
import { DataFileController } from '../../data-file-controller';
import { CATALOG_CLOSE_EVENT, PanelOpenClosesArgs, SOURCE_CLOSE_EVENT, SOURCE_OPEN_EVENT } from '../../global-state/events/panel-open-close';
import { SELECTED_SOURCE_RANGE_EVENT, ASSIGN_TO_SELECTED_NODE, ADD_AS_CHILD, ADD_AS_SIBLING } from '../../global-state/events/source-range';
import { SelectedSourceRefArgs, SELECTED_SOURCE_REF_EVENT } from '../../global-state/events/source-ref';
import { GLOBAL_STATE } from '../../global-state/global-state';
import { generatePanelNumber } from '../panels-common/generatePanelNumber';
import { selectInFrame } from './selectInFrame';
import { createSourceRangeEventArgs } from './createSourceRangeEventArgs';
import { CATALOG_ITEM_SELECTED_EVENT } from '../../global-state/events/catalog-item';

const SourceFileSelect = Select.ofType<SourceFileInfo>();

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
export interface State {
  panelNumber: number;
  sourceRef: SelectedSourceRefArgs | null;
  sourceFile: SourceFileInfo;
  sourceFiles: SourceFileInfo[];
  selection: Selection | null;
}
export class SourcePanel extends React.Component<Props, State> {
  dataFileController = new DataFileController();
  frame: HTMLFrameElement | undefined;
  state = {} as State;
  
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.props.glEventHub.on(CATALOG_CLOSE_EVENT, (args: PanelOpenClosesArgs) => {
      if (args.panelNumber == this.state.panelNumber) {
        setTimeout(() => this.props.glContainer.close());
      }
    });
    let panelNumber = generatePanelNumber(GLOBAL_STATE.OpenSources);
    if (this.state.panelNumber > 1) {
      this.props.glContainer.setTitle(this.props.glContainer.parent.config.title + " " + this.state.panelNumber);
    }
    this.setState({ panelNumber }, () => {
      this.props.glEventHub.emit(SOURCE_OPEN_EVENT, { panelNumber } as PanelOpenClosesArgs);     
    });
    this.props.glEventHub.on(SELECTED_SOURCE_REF_EVENT, (ev: SelectedSourceRefArgs) => {
      if (ev.panelNumber == this.state.panelNumber) {
        this.setItem(ev);
      }
    });
    this.props.glEventHub.on(CATALOG_ITEM_SELECTED_EVENT, () => this.forceUpdate());
    this.loadSources();
  }

  componentWillUnmount() {
    this.props.glEventHub.emit(SOURCE_CLOSE_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
  }

  attachFrame = (frame: HTMLFrameElement) => {
    this.frame = frame;
    if (frame) {
      if (frame.contentWindow) {
        frame.contentWindow.document.addEventListener("selectionchange", debounce(this.onTextSelect.bind(this), 300));
        this.selectSourceRef(this.state.sourceRef);
      } 
      frame.onload = () => {
        frame.contentWindow!.document.addEventListener("selectionchange", debounce(this.onTextSelect.bind(this), 300));
        this.selectSourceRef(this.state.sourceRef);
      }      
    }
  }

  selectSourceRef = (sourceRef: SelectedSourceRefArgs | null) => {
    if (this.frame && sourceRef) {
      selectInFrame(this.frame, sourceRef.ref.sources[sourceRef.sourceIndex]);
    }
  }  

  async loadSources() {
    let sources = await this.dataFileController.getSourceFileInfo();
    this.setState({
      sourceFiles: sources
    });
  }

  setItem(sourceRef: SelectedSourceRefArgs | null) {
    if ( this.state.sourceFiles && sourceRef && sourceRef.ref.sources && sourceRef.sourceIndex >= 0) {
      let sourceFileId = sourceRef.ref.sources[sourceRef.sourceIndex].ranges[0].sourceFileId;
      let sourceFile = this.state.sourceFiles.find(x => x.id == sourceFileId);
      if (sourceFile) {
        this.setState({ sourceRef, sourceFile }, () => {
          this.selectSourceRef(sourceRef);
        });
      }
    }    
  }

  onSelectSource = (source: SourceFileInfo) => {
    this.setState({
      sourceFile: source
    });
  }

  onTextSelect = (ev: Event) => {
    let selection = (ev.target as Document).getSelection();
    if (selection) {
      this.props.glEventHub.emit(SELECTED_SOURCE_RANGE_EVENT, createSourceRangeEventArgs(
        this.state.panelNumber, this.state.sourceFile, selection));
    }
    this.setState({ selection });
  }

  onAssingClick = () => {
    if (this.state.selection) {
      this.props.glEventHub.emit(ASSIGN_TO_SELECTED_NODE, createSourceRangeEventArgs(
        this.state.panelNumber, this.state.sourceFile, this.state.selection));
    }
  }
  onAddChildClick = () => {
    if (this.state.selection) {
      this.props.glEventHub.emit(ADD_AS_CHILD, createSourceRangeEventArgs(
        this.state.panelNumber, this.state.sourceFile, this.state.selection));
    }
  }
  onAddSiblingClick = () => {
    if (this.state.selection) {
      this.props.glEventHub.emit(ADD_AS_SIBLING, createSourceRangeEventArgs(
        this.state.panelNumber, this.state.sourceFile, this.state.selection));
    }
  }

  SourceFrame = styled.iframe`
    width: 100%;
    height: calc(100% - 50px);
  `;

  SourceFileMenuItem = styled.div`
    padding: 3px 7px;
    cursor: pointer;
  `;
  
  render() {
    let smthSelected = this.state.selection && !!this.state.selection.toString();
    return (
      <React.Fragment>
        <Navbar>
          { GLOBAL_STATE.SelectedNode && this.state.sourceRef &&
            <NavbarGroup align={Alignment.LEFT} >
              <Button icon="menu-closed" onClick={this.onAssingClick} disabled={!smthSelected}  minimal text="Назначить" title="Сопоставить с выделенным узлом"  />
              <Button icon="git-new-branch" onClick={this.onAddChildClick} disabled={!smthSelected}  minimal text="Новый подраздел" title="Добавить как дочерний узел"  />
              <Button icon="new-link" onClick={this.onAddSiblingClick} disabled={!smthSelected}  minimal text="Новый раздел" title="Добавить как соседний узел"  />
            </NavbarGroup>
          }
          { this.state.sourceFiles && 
            <NavbarGroup align={Alignment.RIGHT}>
              <SourceFileSelect
                  disabled={!this.state.sourceFiles}
                  items={this.state.sourceFiles}
                  itemRenderer={(item: SourceFileInfo, itemProps: IItemRendererProps) => 
                    <this.SourceFileMenuItem key={item.id} 
                      onClick={itemProps.handleClick}>{item.displayName || item.name}
                    </this.SourceFileMenuItem> }
                  noResults={<MenuItem disabled={true} text="Ничего не найдено" />}
                  onItemSelect={this.onSelectSource}
                  popoverProps={{ minimal: true }}>
                      <Button
                          icon="document-open"
                          loading={!this.state.sourceFiles}
                          rightIcon="caret-down"
                          text={this.state.sourceFile ? `${this.state.sourceFile.displayName || this.state.sourceFile.name}` : "(источник не выбран)"} />
              </SourceFileSelect>
            </NavbarGroup>
          }
        </Navbar>
        <this.SourceFrame 
          src={this.state.sourceFile && (this.state.sourceFile.localUrl)} innerRef={this.attachFrame}>
        </this.SourceFrame>
      </React.Fragment>
    );
  }
}



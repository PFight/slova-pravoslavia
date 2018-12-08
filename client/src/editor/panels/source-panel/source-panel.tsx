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
import { CATALOG_ITEM_SELECTED_EVENT, CatalogItemArgs } from '../../global-state/events/catalog-item';
import { SourceRefSource } from '@common/models/SourceRef';
import { showSelectNameDialog } from './select-name-dialog';
import { getSelectionHtml } from '../panels-common/get-selection-html';

const SourceFileSelect = Select.ofType<SourceFileInfo>();
const LangSelect = Select.ofType<string>();

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
export interface State {
  panelNumber: number;
  sourceRef: SelectedSourceRefArgs | null;
  source: SourceRefSource;
  sourceFile: SourceFileInfo;
  sourceFiles: SourceFileInfo[];
  selection: Selection | null;
  lang: string;
  title: string | undefined;
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
    this.state.title = this.props.glContainer.parent.config.title;
    this.state.panelNumber = GLOBAL_STATE.OpenSources.reduce((prev, cur) => cur > prev ? cur : prev, Number.MIN_VALUE);
    this.togglePanelNumber();

    if (this.props.glContainer.tab) {
      this.props.glContainer.tab.element.on('click', () => this.togglePanelNumber())
    } else {
      this.props.glContainer.on( 'tab', (tab: GoldenLayout.Tab) => {
          tab.element.on('click', () => this.togglePanelNumber())
      });
    }
    
    this.props.glEventHub.on(SELECTED_SOURCE_REF_EVENT, (ev: SelectedSourceRefArgs) => {
      if (ev.panelNumber == this.state.panelNumber) {
        this.setItem(ev);
      }
    });
    this.props.glEventHub.on(CATALOG_ITEM_SELECTED_EVENT, (ev: CatalogItemArgs) => {
      this.forceUpdate();
      if (ev.panelNumber == this.state.panelNumber) {
        if (ev.node && ev.node.data!.sources!.length > 0) {
          this.setItem({
            panelNumber: ev.panelNumber,
            catalogNodeId: ev.node.id,
            ref: ev.node.data!,
            sourceIndex: undefined
          } as  SelectedSourceRefArgs);
        }
      }
    });
    this.loadSources();
  }

  private setPanelNumber(panelNumber: number) {
    this.props.glContainer.setTitle(this.state.title + " " + 
        (panelNumber > 1 ? panelNumber : ''));
    this.setState({ panelNumber }, () => {
      this.props.glEventHub.emit(SOURCE_OPEN_EVENT, { panelNumber } as PanelOpenClosesArgs);
    });
  }

  togglePanelNumber() {
    let catalogs = GLOBAL_STATE.OpenCatalogs.sort();
    let next = catalogs.find(x => x > this.state.panelNumber);
    if (next) {
      this.setPanelNumber(next);
    } else {
      this.setPanelNumber(catalogs[0]);
    }
  }

  componentWillUnmount() {
    this.props.glEventHub.emit(SOURCE_CLOSE_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
  }

  attachFrame = (frame: HTMLFrameElement) => {
    this.frame = frame;
    if (frame) {
      if (frame.contentWindow) {
        frame.contentWindow.document.addEventListener("selectionchange", debounce(this.onTextSelect.bind(this), 300));
        frame.contentWindow.document.addEventListener("keydown", this.onFrameKeyDown);
        this.selectSourceRef(this.state.source);
      } 
      frame.onload = () => {
        frame.contentWindow!.document.addEventListener("selectionchange", debounce(this.onTextSelect.bind(this), 300));
        frame.contentWindow!.document.addEventListener("keydown", this.onFrameKeyDown);
        this.selectSourceRef(this.state.source);
      }      
    }
  }

  selectSourceRef = (source: SourceRefSource | null) => {
    if (this.frame && source) {
      selectInFrame(this.frame, source);
    }
  }  

  async loadSources() {
    let sources = await this.dataFileController.getSourceFileInfo();
    this.setState({
      sourceFiles: sources
    });
  }

  setItem(sourceRef: SelectedSourceRefArgs | null) {
    if ( this.state.sourceFiles && sourceRef && sourceRef.ref.sources &&  sourceRef.ref.sources.length > 0) {
      // Выбран ссылка, которая может содержать множество источников. Нужно выбрать какой из них наш.
      let selectedSource: SourceRefSource | undefined;
      // Явно указан источник
      if (sourceRef.sourceIndex) {
        if (!this.state.lang || sourceRef.ref.sources[sourceRef.sourceIndex].language == this.state.lang) {
          selectedSource = sourceRef.ref.sources[sourceRef.sourceIndex];
        } else {
          // Выбран не наш язык - игнорируем
        }
      } else {
        // Ищем источник на нашем яызыке
        if (this.state.lang) {
          selectedSource = sourceRef.ref.sources!.find(x => x.language == this.state.lang);
        }
        // Если не нашлось, выбираем первый попавшийся
        if (!this.state.lang && !selectedSource) {
          selectedSource = sourceRef.ref.sources[0];
        }
      }
   
      let sourceFile = selectedSource && this.state.sourceFiles.find(x => x.id == selectedSource!.ranges[0].sourceFileId);
      if (selectedSource && sourceFile) {
        this.setState({ sourceRef, sourceFile, source: selectedSource }, () => {
          this.selectSourceRef(selectedSource!);
        });
      } else {
        this.setState({ sourceRef });
      }
    }    
  }

  onSelectSource = (source: SourceFileInfo) => {
    this.setState({
      sourceFile: source,
      selection: null
    });
  }

  onSelectLang = (lang: string) => {
    let sourceFile = this.state.sourceFile;
    if (sourceFile && lang && sourceFile.language != lang) {
      let newSource = this.state.sourceRef!.ref.sources.find(x => x.language == lang);
      if (newSource &&  newSource!.ranges &&  newSource!.ranges.length > 0) {
        sourceFile = this.state.sourceFiles.find(x => x.id == newSource!.ranges[0].sourceFileId)!;
      }
    }
    this.setState({
      lang: lang,
      sourceFile: sourceFile
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
  
  onFrameKeyDown = (ev: KeyboardEvent) => {
    if (ev.keyCode == 13) {
      this.onAddSiblingClick();
    }
  }

  onAssingClick = () => {
    if (this.state.selection) {
      this.props.glEventHub.emit(ASSIGN_TO_SELECTED_NODE, createSourceRangeEventArgs(
        this.state.panelNumber, this.state.sourceFile, this.state.selection));
    }
  }
  onAddChildClick = async () => {
    if (this.state.selection) {
      let additionalData = await showSelectNameDialog(getSelectionHtml(this.state.selection, this.frame!.contentDocument!));
      this.props.glEventHub.emit(ADD_AS_CHILD, createSourceRangeEventArgs(
        this.state.panelNumber, this.state.sourceFile, this.state.selection, additionalData.header));
    }
  }
  onAddSiblingClick = async () => {
    if (this.state.selection) {
      let additionalData = await showSelectNameDialog(getSelectionHtml(this.state.selection, this.frame!.contentDocument!));
      this.props.glEventHub.emit(ADD_AS_SIBLING,
         createSourceRangeEventArgs(this.state.panelNumber, this.state.sourceFile, this.state.selection, additionalData.header));
    }
  }

  SourceFrame = styled.iframe`
    width: 100%;
    height: calc(100% - 50px);
  `;

  MenuItem = styled.div`
    padding: 3px 7px;
    cursor: pointer;
    &:hover {
      background-color: lightgray;
    }
  `;
  
  render() {
    let smthSelected = GLOBAL_STATE.SelectedNode && (this.state.selection && !!this.state.selection.toString());
    const langNames = {
      "chu": "Церковно-славянский",
      "chu-gr": "Церковно-славянский в гражданском начертании",
      "ru": "Русский"
    } as any;
    return (
      <React.Fragment>
        <Navbar>       
          <NavbarGroup align={Alignment.LEFT} >
            <Button icon="menu-closed" onClick={this.onAssingClick} disabled={!smthSelected}  minimal text="в текущий" title="Сопоставить с выделенным узлом"  />
            <Button icon="git-new-branch" onClick={this.onAddChildClick} disabled={!smthSelected}  minimal text="+ подраздел" title="Добавить как дочерний узел"  />
            <Button icon="new-link" onClick={this.onAddSiblingClick} disabled={!smthSelected}  minimal text="+ раздел" title="Добавить как соседний узел"  />
          </NavbarGroup>          
          { this.state.sourceFiles && 
            <NavbarGroup align={Alignment.RIGHT}>
              <SourceFileSelect
                  disabled={!this.state.sourceFiles}
                  items={this.state.sourceFiles.filter(x => x.language == this.state.lang || !this.state.lang)}
                  itemRenderer={(item: SourceFileInfo, itemProps: IItemRendererProps) => 
                    <this.MenuItem key={item.id} 
                      onClick={itemProps.handleClick}>{item.displayName || item.name}
                    </this.MenuItem> }
                  noResults={<MenuItem disabled={true} text="Ничего не найдено" />}
                  onItemSelect={this.onSelectSource}
                  popoverProps={{ minimal: true }}>
                      <Button
                          icon="document-open"
                          loading={!this.state.sourceFiles}
                          rightIcon="caret-down"
                          text={this.state.sourceFile ? `${this.state.sourceFile.displayName || this.state.sourceFile.name}` : "(источник не выбран)"} />
              </SourceFileSelect>
              <div style={{width: 5}} />
              <LangSelect 
                disabled={!this.state.sourceFiles}
                items={["", "chu", "chu-gr", "ru"]}
                itemRenderer={(item: string, itemProps: IItemRendererProps) =>
                  <this.MenuItem title={langNames[item]} onClick={itemProps.handleClick}>
                    {(langNames[item] || 'Любой') + ' (' + (item || '-') + ')'}
                  </this.MenuItem>
                }
                onItemSelect={this.onSelectLang}
                filterable={false}
                popoverProps={{ minimal: true }}>
                <Button
                    loading={!this.state.sourceFiles}
                    rightIcon="caret-down"
                    title="Предпочитаемый язык текстов, отображаемых в данной панели"
                    text={this.state.lang || "-"} />
              </LangSelect>
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



import React from 'react';
import { CatalogNode } from '@common/models/CatalogNode';
import { ITreeNode, Button, Classes } from '@blueprintjs/core';
import { AsyncAtion } from "../../utils/async-action";
import styled from 'styled-components';

export interface Props {
  node: ITreeNode<CatalogNode>;
  onAccept: (node: ITreeNode<CatalogNode>, newText: string) => Promise<void>;
  onCancel: (node: ITreeNode<CatalogNode>) => void;
}

interface State {  
}

export class NodeNameEditor extends React.Component<Props, State> {
  state = {} as State;
  save = new AsyncAtion();
  input: HTMLInputElement | undefined;

  attachInput = (elem: HTMLInputElement) => {
    this.input = elem;
    let node = this.props.node;
    if (elem && node.nodeData && node.nodeData.data) {
      elem.value = node.nodeData.data.caption || '';
      elem.selectionStart = 0;
      elem.selectionEnd = elem.value.length;
      elem.focus();
    }
  }

  onKeyDown = (ev: React.KeyboardEvent<any>) => {
    if (ev.keyCode == 13) {
      this.onAccept();
    }
  }

  onAccept = () => {
    this.save.go(() => this.props.onAccept(this.props.node, this.input && this.input.value || ''));
  }

  onCancel = () => {
    this.props.onCancel(this.props.node);
  }

  editInput = styled.input`
    margin: 2px;
  `

  render() {
    return (
      <div className="display-flex">
        <this.editInput className={"flex-spring " + Classes.INPUT} 
          innerRef={this.attachInput} onKeyDown={this.onKeyDown} />
        <Button icon="small-tick" className="flex-static margin-v-auto" onClick={this.onAccept} />
        <Button icon="small-cross" className="flex-static margin-v-auto" onClick={this.onCancel} />
      </div>
    );
  }
}
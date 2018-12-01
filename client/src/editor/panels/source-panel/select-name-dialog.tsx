import React from 'react';
import { Overlay, Classes, Dialog, Button } from '@blueprintjs/core';
import ReactDOM from 'react-dom';

interface Props {  
  nodeText: string;
  onAccept: (header: string | null) => void;
  onCancel: () => void;
}

interface State {
  shown: boolean;
  selection: string | undefined;
}

class SelectNameDialog extends React.Component<Props, State> {
  state: State = {} as any;  
  constructor(props: Props) {
    super(props);
    this.state.shown = true; 
  }
  componentDidMount() {
    document.addEventListener("selectionchange", this.onTextSelect)
    document.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("selectionchange", this.onTextSelect)
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onTextSelect = (ev: Event) => {
    let selection = (ev.target as Document).getSelection();
    if (selection && selection.toString()) {
      this.setState({ selection: selection.toString().trim() });
    }
  }
  onAccept = () => {
    this.setState({shown: false}, () => this.props.onAccept(this.state.selection || null));
  }
  onCancel = () => {
    this.setState({shown: false}, () => this.props.onCancel());  
  }
  onKeyDown = (ev: KeyboardEvent) => {
    if (ev.keyCode == 13) { // Enter
      this.onAccept();
    } else if (ev.keyCode == 27) { // Esc
      this.onCancel();
    }
  }

  render() {
    return (
      <Dialog isOpen={this.state.shown} onClose={this.onCancel} 
        title="Выберите заголовок" className={Classes.OVERLAY_SCROLL_CONTAINER} 
        hasBackdrop={true} autoFocus={true}>
        <div className={Classes.DIALOG_BODY}  >
          <div dangerouslySetInnerHTML={{__html: this.props.nodeText}}></div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.onAccept}>ОК</Button>
            <Button onClick={this.onCancel}>Отмена</Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

interface Result {
  header?: string;
}

export function showSelectNameDialog(nodeText: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    let container = document.createElement("div");
    document.body.appendChild(container);
    let dispose = () => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    }
    let accept = (text: string | null) => {
      resolve({header: text || undefined});
      dispose();
    }
    let cancel = () => {
      reject();
      dispose();
    }
    ReactDOM.render(
      <SelectNameDialog
          nodeText={nodeText}
          onCancel={cancel}
          onAccept={accept}>
      </SelectNameDialog>,
      container);
  });    
}
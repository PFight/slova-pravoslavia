import * as React from "react";
import { HeaderContainer, BodyContainer } from './main-layout';
import { Header } from './header/header';
import GoldenLayout from "golden-layout";
import { DEFAULT_CONFIG } from "./config/default-config";
import { loadConfig } from "./config/config-store";
import { PANELS, registerPanels } from './panels/panels';
import ReactDOM from 'react-dom';

interface IEditorAppState {
  
}

export class EditorApp extends React.Component<{}, IEditorAppState> {
  layout: GoldenLayout | undefined;
  state = {} as IEditorAppState;

  constructor(props: {}) {
    super(props);

    let config = DEFAULT_CONFIG;
  }

  componentDidMount() {
  } 

  mountLayout = async (bodyElem: HTMLElement | null) => {
    if (bodyElem) {
      let config = await loadConfig();
      this.layout = new GoldenLayout(config, bodyElem);
      registerPanels(this.layout);
      (window as any)["React"] = React;
      (window as any)["ReactDOM"] = ReactDOM;
      this.layout.init();
      this.forceUpdate();
    }
  }

  render() {
    return (
      <React.Fragment>
        <HeaderContainer >
          {this.layout && 
            <Header layout={this.layout} panels={PANELS} /> }
        </HeaderContainer>
        <BodyContainer innerRef={this.mountLayout}> 

        </BodyContainer>
      </React.Fragment>
    );
  }
}
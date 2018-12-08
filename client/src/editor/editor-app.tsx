import * as React from "react";
import { HeaderContainer, BodyContainer } from './main-layout';
import { Header } from './header/header';
import GoldenLayout from "golden-layout";
import { DEFAULT_CONFIG } from "./config/default-config";
import { loadConfig } from "./config/config-store";
import { PANELS, registerPanels } from './panels/panels';
import ReactDOM from 'react-dom';
import { initGlobalState } from "./global-state/global-state";

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
      const SAVED_STATE_KEY = 'savedState';
      var savedState = localStorage.getItem(SAVED_STATE_KEY);
      if( savedState !== null ) {
         this.layout = new GoldenLayout(JSON.parse(savedState), bodyElem);
      } else {
         this.layout = new GoldenLayout(config, bodyElem);
      }
      this.layout.on('stateChanged', () => {
          var state = JSON.stringify(this.layout!.toConfig());
          localStorage.setItem(SAVED_STATE_KEY, state );
      });

      registerPanels(this.layout);
      (window as any)["React"] = React;
      (window as any)["ReactDOM"] = ReactDOM;
      initGlobalState(this.layout.eventHub);
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
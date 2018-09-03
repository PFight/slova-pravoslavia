import * as React from 'react';
import * as GoldenLayout from "golden-layout";
import { HeaderFill } from './header-fill';
import { HeaderLogoIcon } from './header-logo-icon';
import { PanelDescription } from "../panels/panel-description";
import styled from 'styled-components';
import { LogoWrapper } from './logo-wrapper';
import { PanelWrapper } from './panel-wrapper';


export interface HeaderProps {
  layout: GoldenLayout;
  panels: PanelDescription[];
}

export class Header extends React.PureComponent<HeaderProps> {
  private attachDragSource = (elem: HTMLElement | null, description: PanelDescription) => {
    if (elem != null) {
      this.props.layout.createDragSource(elem, description.config);
    }
  }

  render() {
    return (
      <HeaderFill className="display-flex">
        <LogoWrapper className="flex-static">
          <HeaderLogoIcon />
        </LogoWrapper>
        <div className="flex-spring"/>
        {this.props.panels && this.props.panels.map(x => 
          <PanelWrapper className="flex-static" title={x.description} 
            innerRef={(el) => this.attachDragSource(el, x)}>
            {x.iconRender()}
          </PanelWrapper>
        )}
      </HeaderFill>
    );
  }
}
import * as React from 'react';
import * as GoldenLayout from "golden-layout";
import { HeaderFill } from './header-fill';
import { HeaderLogoIcon } from './header-logo-icon';
import { PanelDescription } from "../panels/panel-description";
import { LogoWrapper } from './logo-wrapper';
import { PanelWrapper } from './panel-wrapper';
import { TitleLabel } from './title-label';


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
        <TitleLabel className="flex-static">Слова</TitleLabel>
        <div className="flex-spring"/>
        {this.props.panels && this.props.panels.map((x, i) => 
          <PanelWrapper key={i} className="flex-static" title={x.description} 
            innerRef={(el) => this.attachDragSource(el, x)}>
            {x.iconRender()}
          </PanelWrapper>
        )}
      </HeaderFill>
    );
  }
}
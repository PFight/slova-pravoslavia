import * as React from "react";
import { DataFileController} from "./data-file-controller";
import { CatalogNode } from '@common/models/CatalogNode';

interface IEditorAppState {
  catalog: CatalogNode[];
  newNodeText: string;
}

export class EditorApp extends React.Component<{}, IEditorAppState> {
  controller = new DataFileController();
  state = {} as IEditorAppState;

  componentDidMount() { 
      this.loadCatalog();
  }

  async loadCatalog() {
    let catalog = await this.controller.getCatalog();
    this.setState({ catalog: catalog });  
  }

  onAdd = async () => {
    this.state.catalog.push({
      id: this.state.newNodeText
    } as any);
    await this.controller.saveCatalog(this.state.catalog);
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <h2>Hello there:</h2>
        <ul>
          {this.state.catalog && this.state.catalog.map(c => 
            <li>{c.id}<span>{c.data && c.data.caption}</span></li>
          )}
        </ul>
        <input value={this.state.newNodeText} onChange={(ev) => this.setState({newNodeText: ev.target.value})} />
        <button onClick={this.onAdd}>Add</button>
      </div>
    );
  }
}
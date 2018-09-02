import "core-js";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { EditorApp } from './editor-app';

let root = document.getElementById("app");
ReactDOM.render(<EditorApp />, root);
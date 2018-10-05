import React from "react";
import * as monaco from "monaco-editor";
const fs = window.require("fs");
const { ipcRenderer, dialog } = require("electron");
import { connect } from "react-redux";
import { getFileName, setEditor } from "../../js/actions/action";

class Editor extends React.Component {
  componentDidMount() {
    self.MonacoEnvironment = {
      getWorkerUrl: function(moduleId, label) {
        if (label === "json") {
          return "../dist/json.worker.bundle.js";
        }
        if (label === "css") {
          return "../dist/css.worker.bundle.js";
        }
        if (label === "html") {
          return "../dist/html.worker.bundle.js";
        }
        if (label === "typescript" || label === "javascript") {
          return "../dist/ts.worker.bundle.js";
        }
        return "../dist/editor.worker.bundle.js";
      }
    };

    const starterText = [
      "function x() {",
      '\tconsole.log("Whatup world!");',
      "}"
    ].join("\n");

    const monacoEditor = monaco.editor.create(
      document.getElementById("editor-container"),
      {
        value: starterText,
        language: "javascript",
        automaticLayout: true
      }
    );

    this.props.setEditor(monacoEditor);

    // // display selected file from menu in text editor
    ipcRenderer.on("open-file", (event, arg, filename) => {
      this.props.getFileName(filename);

      this.props.editor.setValue(arg);
      console.log(arg);
    });

    // listen for main process prompt to save file
    ipcRenderer.on("save-file", (event, arg) => {
      console.log("filename", this.props.filename);

      ipcRenderer.send(
        "save-file",
        this.props.editor.getValue(),
        this.props.filename
      );
    });
  }

  render() {
    // console.log('editor', this.props.editor);
    return <div id="editor-container" />;
  }
}

function mapStateToProps(state) {
  return {
    editor: state.editorReducer.editor,
    filename: state.editorReducer.filename
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setEditor: editor => dispatch(setEditor(editor)),
    getFileName: filename => dispatch(getFileName(filename))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);

// export default Editor;

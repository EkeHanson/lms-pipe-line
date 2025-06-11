import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const DraftEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (value) {
      try {
        const content = convertFromRaw(JSON.parse(value));
        setEditorState(EditorState.createWithContent(content));
      } catch {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [value]);

  const handleChange = (state) => {
    setEditorState(state);
    const content = convertToRaw(state.getCurrentContent());
    onChange(JSON.stringify(content));
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleChange}
      wrapperClassName="wrapper-class"
      editorClassName="editor-class"
      toolbarClassName="toolbar-class"
    />
  );
};

export default DraftEditor;
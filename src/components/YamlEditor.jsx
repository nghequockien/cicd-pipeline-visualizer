import "./YamlEditor.css";

export default function YamlEditor({ value, onChange }) {
  return (
    <div className="yaml-editor">
      <h3>YAML Editor</h3>
      <textarea
        className="editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or edit your YAML content here..."
        spellCheck="false"
      />
    </div>
  );
}

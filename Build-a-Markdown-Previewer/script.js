marked.setOptions({
  breaks: true,
  gfmL: true
});

class App extends React.Component {
  constructor({ placeholderMarkdown }) {
    super(placeholderMarkdown);
    this.state = {
      markdown: placeholderMarkdown
    };
    this.setMarkdown = this.setMarkdown.bind(this);
  }
  htmlOutput() {
    return { __html: marked(this.state.markdown) };
  }
  setMarkdown(e) {
    this.setState({ markdown: e.target.value });
  }
  render() {
    return (
      <div>
        <h1 id="title" className="text-center">
          React Markdown Previewer
        </h1>
        <div id="container">
          <Editor value={this.state.markdown} onChange={this.setMarkdown} />
          <Previewer htmlOutput={this.htmlOutput()} />
        </div>
      </div>
    );
  }
}

const Editor = ({ value, onChange }) => {
  return (
    <div id="editor-container">
      <div id="editor-header">
        <h2>
          <i className="fas fa-code header-icon"></i>Editor
        </h2>
      </div>
      <textarea
        id="editor"
        rows="20"
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
};

const Previewer = ({ htmlOutput }) => {
  return (
    <div id="preview-container">
      <div id="preview-header">
        <h2>
          <i className="fas fa-eye header-icon"></i>Preview
        </h2>
      </div>
      <div dangerouslySetInnerHTML={htmlOutput} id="preview" />
    </div>
  );
};

const placeholderMarkdown = `# Header 
## Sub-header
A Link: [Joey Vega](https://freecodecamp.com/joeyvega)
\`code\`
\`\`\`
code block
\`\`\`
- list
> Block Quote
**Bold**
![Placeholder Image](https://via.placeholder.com/150)
A paragraph with a
line break`;

ReactDOM.render(
  <App placeholderMarkdown={placeholderMarkdown} />,
  document.getElementById("app")
);

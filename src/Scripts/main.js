exports.activate = () => {};

const issues = new IssueCollection();

const handleResults = () => {
  const fp = nova.workspace.path + "/.nova/rspec.json";
  const output = JSON.parse(nova.fs.open(fp).read());

  output.examples
    .filter((example) => example.status === "failed")
    .forEach((example) => {
      const exception = example.exception;
      const issue = new Issue();
      issue.message = exception.message;
      issue.severity = IssueSeverity.Error;
      issue.line = example.line_number;
      var path = nova.path.join(nova.workspace.path, example.file_path);
      path = "file://" + path;
      issues.append(path, [issue]);
    });
};

const runSpecsAndParseResults = (filePath) => {
  issues.clear();
  const useBundler = nova.workspace.config.get("rspec-runner.bundler");
  const rspecBase = useBundler ? ["bundle", "exec", "rspec"] : ["rspec"];
  const proc = new Process("/usr/bin/env", {
    args: [
      ...rspecBase,
      filePath,
      "--format",
      "json",
      "--out",
      ".nova/rspec.json",
    ],
    cwd: nova.workspace.path,
  });
  proc.onStdout((x) => console.log(x));
  proc.onStderr((x) => console.error(x));
  proc.start();
  proc.onDidExit(handleResults);
};

const lineNumber = (textEditor) => {
  const position = textEditor.selectedRange.start;
  const file = nova.fs.open(textEditor.document.path);
  const content = file.read(position);
  const newlines = (content.match(/\n/g) || []).length;
  return 1 + newlines;
};

nova.commands.register("rspec-runner.allSpecs", (workspace) => {
  runSpecsAndParseResults("spec/");
});

nova.commands.register("rspec-runner.fileSpecs", (textEditor) => {
  const [_other, specPath] = textEditor.document.path.split(
    nova.workspace.path + "/"
  );
  runSpecsAndParseResults(specPath);
});

nova.commands.register("rspec-runner.lineSpecs", (textEditor) => {
  const [_other, specPath] = textEditor.document.path.split(
    nova.workspace.path + "/"
  );
  const specLinePath = specPath + ":" + lineNumber(textEditor);
  runSpecsAndParseResults(specLinePath);
});

exports.deactivate = () => {
  issues.dispose();
};

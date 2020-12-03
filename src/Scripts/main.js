exports.activate = () => {};

const issues = new IssueCollection();
const workspace_regex = /\/Volumes\/[^\/]*\//;
const line_number_regex = /:(\d*):in/;

const handleResults = () => {
  const fp = nova.workspace.path + "/.nova/rspec.json";
  const output = JSON.parse(nova.fs.open(fp).read());
  const workspace_path = nova.workspace.path.replace(workspace_regex, "/");
  const failed_examples = output.examples.filter(
    (example) => example.status === "failed"
  );

  if (failed_examples.length == 0) {
    const issue = new Issue();
    issue.message = "Success";
    issue.secerity = IssueSeverity.Info;
    issues.append(workspace_path, [issue]);
  }

  failed_examples.forEach((example) => {
    const exception = example.exception;
    const issue = new Issue();
    const backtrace = exception.backtrace.find((line) =>
      line.startsWith(workspace_path)
    );
    const line_number = backtrace
      ? backtrace.match(line_number_regex)[1]
      : example.line_number;
    issue.message = exception.message.trim();
    issue.severity = IssueSeverity.Error;
    issue.line = line_number;
    var path = nova.path.join(workspace_path, example.file_path);
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

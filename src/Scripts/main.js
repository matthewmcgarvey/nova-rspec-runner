exports.activate = () => {};

const issues = new IssueCollection();

nova.commands.register("rspec-runner.allSpecs", (workspace) => {
  issues.clear();
  const proc = new Process("/usr/bin/env", {
    args: ["rspec", "spec/", "--format", "json", "--out", ".nova/rspec.json"],
    cwd: nova.workspace.path,
  });
  proc.onStdout((x) => console.log(x));
  proc.onStderr((x) => console.error(x));
  proc.start();
  proc.onDidExit(() => {
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
  });
});

exports.deactivate = () => {
  issues.dispose();
};

<a href="https://github.com/2tunnels/extra-vars/actions"><img alt="typescript-action status" src="https://github.com/2tunnels/extra-vars/workflows/build-test/badge.svg"></a>

# Extra environment variables

This action exports additional environment variables for the next steps after it. GitHub Actions provides some environment variables. However, sometimes you might need some value that can be `grep`ed from the provided environment variables, parsed from the context JSON file, or fetched from API. This action tries to fill this gap by getting these values for you and exporting them as environment variables for easy scripting.

## Usage

```yaml
- name: Extra environment variables
  uses: 2tunnels/extra-vars@v0.0.1
- name: Do something useful with exported variables
  run: >
    # Get details about pull request
    echo "Pull request number: ${EXTRA_PULL_REQUEST_NUMBER}"

    # Run mypy linter only for changed python files
    echo $EXTRA_FILES_CHANGED | grep '.py$' | xargs mypy
```

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
<th>Examples</th>
<th>Availability</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>EXTRA_EVENT_NAME</code></td>
<td>Name of the event triggered workflow.</td>
<td><code>pull_request</code>, <code>push</code></td>
<td>Always</td>
</tr>
<tr>
<td><code>EXTRA_SHA</code></td>
<td>Commit SHA.</td>
<td><code>29d...ae7</code></td>
<td>Always</td>
</tr>
<tr>
<td><code>EXTRA_REF</code></td>
<td>The full git ref that was pushed.</td>
<td><code>refs/heads/main</code></td>
<td>Always</td>
</tr>
<tr>
<td><code>EXTRA_WORKFLOW</code></td>
<td>Current workflow name.</td>
<td><code>build</code>, <code>test</code></td>
<td>Always</td>
</tr>
<tr>
<td><code>EXTRA_REPO_OWNER</code></td>
<td>Repository owner.</td>
<td><code>2tunnels</code>, <code>actions</code></td>
<td>Always</td>
</tr>
<tr>
<td><code>EXTRA_REPO_NAME</code></td>
<td>Repository name.</td>
<td><code>extra-vars</code>, <code>toolkit</code></td>
<td>Always</td>
</tr>
<tr>
<td><code>EXTRA_PAYLOAD_ACTION</code></td>
<td>Activity that triggered the event. (https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#webhook-payload-object-common-properties)</td>
<td><code>synchronize</code>, <code>closed</code></td>
<td>Most events</td>
</tr>
<tr>
<td><code>EXTRA_FILES_CHANGED</code></td>
<td>Multiline list of changed (added, modified, removed and renamed) files.</td>
<td>foo.ts<br>bar.js<br>baz.py</td>
<td><code>pull_request</code> and <code>push</code></td>
</tr>
<tr>
<td><code>EXTRA_FILES_ADDED</code></td>
<td>Multiline list of added files.</td>
<td>foo.ts<br>bar.js<br>baz.py</td>
<td><code>pull_request</code> and <code>push</code></td>
</tr>
<tr>
<td><code>EXTRA_FILES_MODIFIED</code></td>
<td>Multiline list of modified files.</td>
<td>foo.ts<br>bar.js<br>baz.py</td>
<td><code>pull_request</code> and <code>push</code></td>
</tr>
<tr>
<td><code>EXTRA_FILES_REMOVED</code></td>
<td>Multiline list of removed files.</td>
<td>foo.ts<br>bar.js<br>baz.py</td>
<td><code>pull_request</code> and <code>push</code></td>
</tr>
<tr>
<td><code>EXTRA_FILES_RENAMED</code></td>
<td>Multiline list of renamed files.</td>
<td>foo.ts<br>bar.js<br>baz.py</td>
<td><code>pull_request</code> and <code>push</code></td>
</tr>
<tr>
<td><code>EXTRA_PULL_REQUEST_NUMBER</code></td>
<td>Pull request number.</td>
<td><code>1</code></td>
<td><code>pull_request</code></td>
</tr>
<tr>
<td><code>EXTRA_PULL_REQUEST_TITLE</code></td>
<td>Pull request title.</td>
<td><code>Fix</code></td>
<td><code>pull_request</code></td>
</tr>
<tr>
<td><code>EXTRA_PULL_REQUEST_STATE</code></td>
<td>Pull request state.</td>
<td><code>open</code>, <code>closed</code></td>
<td><code>pull_request</code></td>
</tr>
<tr>
<td><code>EXTRA_PULL_REQUEST_COMMITS</code></td>
<td>Number of commits in current pull request.</td>
<td><code>1</code></td>
<td><code>pull_request</code></td>
</tr>
<tr>
<td><code>EXTRA_PULL_REQUEST_ADDITIONS</code></td>
<td>Number of added lines in current pull request.</td>
<td><code>1</code></td>
<td><code>pull_request</code></td>
</tr>
<tr>
<td><code>EXTRA_PULL_REQUEST_DELETIONS</code></td>
<td>Number of deleted lines in current pull request.</td>
<td><code>1</code></td>
<td><code>pull_request</code></td>
</tr>
<tr>
<td><code>EXTRA_PULL_REQUEST_CHANGED_FILES</code></td>
<td>Number of changed files in current pull request.</td>
<td><code>1</code></td>
<td><code>pull_request</code></td>
</tr>
</tbody>
</table>

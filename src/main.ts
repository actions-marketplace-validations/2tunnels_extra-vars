import * as core from '@actions/core';
import * as github from '@actions/github';
import {GitHub} from '@actions/github/lib/utils';
import {PullRequestEvent} from '@octokit/webhooks-definitions/schema';

function exportVar(name: string, val: string | string[] | number): void {
  if (Array.isArray(val)) {
    core.exportVariable(name, `${val.join('\n')}\n`);
  } else {
    core.exportVariable(name, val.toString());
  }
}

async function exportPullRequestVariables(
  prefix: string,
  octokit: InstanceType<typeof GitHub>
): Promise<void> {
  const event = github.context.payload as PullRequestEvent;
  const pull_request = event.pull_request;
  const namespace = `${prefix}_PULL_REQUEST`;

  // Export variables from context
  exportVar(`${namespace}_NUMBER`, pull_request.number);
  exportVar(`${namespace}_TITLE`, pull_request.title);
  exportVar(`${namespace}_STATE`, pull_request.state);
  exportVar(`${namespace}_COMMITS`, pull_request.commits);
  exportVar(`${namespace}_ADDITIONS`, pull_request.additions);
  exportVar(`${namespace}_DELETIONS`, pull_request.deletions);
  exportVar(`${namespace}_CHANGED_FILES`, pull_request.changed_files);

  // Export variables from API
  const response = await octokit.rest.pulls.listFiles({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: pull_request.number
  });

  const filesChanged = response.data.map(file => file.filename);
  const filesAdded = response.data
    .filter(file => file.status === 'added')
    .map(file => file.filename);
  const filesModified = response.data
    .filter(file => file.status === 'modified')
    .map(file => file.filename);
  const filesRemoved = response.data
    .filter(file => file.status === 'removed')
    .map(file => file.filename);
  const filesRenamed = response.data
    .filter(file => file.status === 'renamed')
    .map(file => file.filename);

  exportVar(`${namespace}_FILES_CHANGED`, filesChanged);
  exportVar(`${namespace}_FILES_ADDED`, filesAdded);
  exportVar(`${namespace}_FILES_MODIFIED`, filesModified);
  exportVar(`${namespace}_FILES_REMOVED`, filesRemoved);
  exportVar(`${namespace}_FILES_RENAMED`, filesRenamed);
}

async function run(): Promise<void> {
  const token = core.getInput('token');
  const prefix = core.getInput('prefix');
  const octokit = github.getOctokit(token);

  core.info(`Event name: ${github.context.eventName}`);

  // Export general variables
  if (github.context.payload.action !== undefined) {
    core.exportVariable(`${prefix}_ACTION`, github.context.payload.action);
  }

  // Export pull request related variables
  if (github.context.eventName === 'pull_request') {
    return await exportPullRequestVariables(prefix, octokit);
  }
}

run();

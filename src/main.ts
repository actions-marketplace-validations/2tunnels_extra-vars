import * as core from '@actions/core';
import * as github from '@actions/github';
import {GitHub} from '@actions/github/lib/utils';
import {
  PullRequestEvent,
  PushEvent
} from '@octokit/webhooks-definitions/schema';

function exportVar(name: string, val: string | string[] | number): void {
  if (Array.isArray(val)) {
    core.exportVariable(name, val.join('\n'));
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

  exportVar(`${prefix}_FILES_CHANGED`, filesChanged);
  exportVar(`${prefix}_FILES_ADDED`, filesAdded);
  exportVar(`${prefix}_FILES_MODIFIED`, filesModified);
  exportVar(`${prefix}_FILES_REMOVED`, filesRemoved);
  exportVar(`${prefix}_FILES_RENAMED`, filesRenamed);
}

async function exportPushVariables(
  prefix: string,
  octokit: InstanceType<typeof GitHub>
): Promise<void> {
  const event = github.context.payload as PushEvent;
  const namespace = `${prefix}_PUSH`;

  // Export variables from context
  exportVar(`${namespace}_REF`, event.ref);
  exportVar(`${namespace}_BEFORE`, event.before);
  exportVar(`${namespace}_AFTER`, event.after);

  // Export variables from API
  const response = await octokit.rest.repos.compareCommits({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    base: event.before,
    head: event.after
  });

  let filesChanged: string | string[] = '';
  let filesAdded: string | string[] = '';
  let filesModified: string | string[] = '';
  let filesRemoved: string | string[] = '';
  let filesRenamed: string | string[] = '';

  if (response.data.files !== undefined) {
    filesChanged = response.data.files.map(file => file.filename);
    filesAdded = response.data.files
      .filter(file => file.status === 'added')
      .map(file => file.filename);
    filesModified = response.data.files
      .filter(file => file.status === 'modified')
      .map(file => file.filename);
    filesRemoved = response.data.files
      .filter(file => file.status === 'removed')
      .map(file => file.filename);
    filesRenamed = response.data.files
      .filter(file => file.status === 'renamed')
      .map(file => file.filename);
  }

  exportVar(`${prefix}_FILES_CHANGED`, filesChanged);
  exportVar(`${prefix}_FILES_ADDED`, filesAdded);
  exportVar(`${prefix}_FILES_MODIFIED`, filesModified);
  exportVar(`${prefix}_FILES_REMOVED`, filesRemoved);
  exportVar(`${prefix}_FILES_RENAMED`, filesRenamed);
}

async function run(): Promise<void> {
  const token = core.getInput('token');
  const prefix = core.getInput('prefix');
  const octokit = github.getOctokit(token);

  // Export general variables
  exportVar(`${prefix}_EVENT_NAME`, github.context.eventName);
  exportVar(`${prefix}_SHA`, github.context.sha);
  exportVar(`${prefix}_REF`, github.context.ref);
  exportVar(`${prefix}_WORKFLOW`, github.context.workflow);
  exportVar(`${prefix}_REPO_OWNER`, github.context.repo.owner);
  exportVar(`${prefix}_REPO_REPO`, github.context.repo.repo);

  if (github.context.payload.action !== undefined) {
    exportVar(`${prefix}_PAYLOAD_ACTION`, github.context.payload.action);
  }

  // Export pull request related variables
  if (github.context.eventName === 'pull_request') {
    return await exportPullRequestVariables(prefix, octokit);
  }

  // Export push related variables
  if (github.context.eventName === 'push') {
    return await exportPushVariables(prefix, octokit);
  }
}

run();

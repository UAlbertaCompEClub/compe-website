/**
 * Adds a "Website" menu to the content Sheet.
 *
 * Install: in the Sheet, Extensions → Apps Script, paste this file, save.
 * Then Project Settings → Script properties → add GITHUB_TOKEN (see docs/content-sync-setup.md).
 */
const REPO = 'UAlbertaCompEClub/compe-website';
const WORKFLOW_URL = 'https://github.com/' + REPO + '/actions/workflows/sync-content.yml';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Website')
    .addItem('Publish now', 'publishWebsite')
    .addItem('See recent publishes', 'showRecentPublishes')
    .addToUi();
}

function publishWebsite() {
  const ui = SpreadsheetApp.getUi();
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) {
    ui.alert(
      "Publishing isn't set up yet",
      'Ask the web lead to add GITHUB_TOKEN under Extensions → Apps Script → Project Settings → Script properties.',
      ui.ButtonSet.OK,
    );
    return;
  }

  const response = UrlFetchApp.fetch('https://api.github.com/repos/' + REPO + '/dispatches', {
    method: 'post',
    contentType: 'application/json',
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    payload: JSON.stringify({ event_type: 'content-publish' }),
  });

  if (response.getResponseCode() === 204) {
    ui.alert(
      'Publishing started',
      'The website updates in a few minutes. If something in the Sheet has a problem, the site stays as it was ' +
        'and the list of problems appears under Website → See recent publishes.',
      ui.ButtonSet.OK,
    );
  } else {
    ui.alert(
      "Publishing didn't start",
      'GitHub answered ' + response.getResponseCode() + '. The GITHUB_TOKEN may have expired; ask the web lead to replace it.\n\n' +
        response.getContentText().slice(0, 300),
      ui.ButtonSet.OK,
    );
  }
}

function showRecentPublishes() {
  const html = HtmlService.createHtmlOutput(
    '<p style="font-family:sans-serif">Each run shows what was published, or the problems to fix.</p>' +
      '<p style="font-family:sans-serif"><a href="' + WORKFLOW_URL + '" target="_blank">Open publish history on GitHub</a></p>',
  )
    .setWidth(360)
    .setHeight(120);
  SpreadsheetApp.getUi().showModalDialog(html, 'Recent publishes');
}

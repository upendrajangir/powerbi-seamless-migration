const axios = require("axios");
const { deleteAllDashboards } = require("./dashboards");
const { deleteAllReports } = require("./reports");
const { deleteAllDatasets } = require("./datasets");

/**
 * Clean a Power BI workspace by deleting all its datasets, reports, and dashboards.
 * @param {string} accessToken The access token to authenticate the API requests.
 * @param {string} workspaceId The ID of the workspace to clean.
 * @throws Will throw an error if any of the API requests fail.
 */
async function cleanWorkspace(accessToken, workspaceId) {
  try {
    console.log(`Cleaning workspace '${workspaceId}'...`);

    // Delete all datasets in the workspace
    await deleteAllDatasets(accessToken, workspaceId);

    // Delete all reports in the workspace
    await deleteAllReports(accessToken, workspaceId);

    // Delete all dashboards in the workspace
    await deleteAllDashboards(accessToken, workspaceId);

    console.log(`Workspace '${workspaceId}' cleaned successfully`);
  } catch (error) {
    console.error(
      `Error cleaning workspace '${workspaceId}': ${error.message}`
    );

    // Rethrow the error to propagate it to the calling code
    throw error;
  }
}

module.exports = {
  cleanWorkspace,
};

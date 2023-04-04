require("dotenv").config();
const {
  listReports,
  cloneReport,
  exportPowerBIReport,
} = require("./src/modules/reports.js");
const {
  listDatasets,
  takeOverDataset,
  updateDatasource,
} = require("./src/modules/datasets.js");
const { fetchPowerBIAccessToken } = require("./src/modules/powerbiAuth.js");

const clientId = process.env.AZURE_APP_ID;
const clientSecret = process.env.AZURE_APP_SECRET;
const tenantId = process.env.AZURE_TENANT_ID;
const sourceWorkspaceId = process.env.SOURCE_WORKSPACE_ID;
const targetWorkspaceId = process.env.TARGET_WORKSPACE_ID;

/**
 * Clone reports in parallel with a specified batch size.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {Array} reports - Array of reports to be cloned.
 * @param {number} batchSize - Number of reports to clone in parallel.
 * @returns {Promise<Array>} - Array of cloned report objects.
 */
async function cloneReportsInParallel(accessToken, reports, batchSize = 10) {
  let currentBatch = [];
  const clonedReports = [];

  for (const report of reports) {
    currentBatch.push(
      cloneReport(
        accessToken,
        sourceWorkspaceId,
        report.id,
        targetWorkspaceId,
        report.datasetId,
        `${report.name}`
      )
    );

    if (currentBatch.length === batchSize) {
      const batchResults = await Promise.all(currentBatch);
      clonedReports.push(...batchResults);
      currentBatch = [];
    }
  }

  if (currentBatch.length > 0) {
    const batchResults = await Promise.all(currentBatch);
    clonedReports.push(...batchResults);
  }

  return clonedReports;
}

/**
 * Update data sources for all datasets.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {Array} datasets - Array of datasets to update data sources.
 * @returns {Promise<Array>} - Array of updated dataset objects.
 */
async function takeOverAndUpdateDataSources(accessToken, datasets) {
  const updatedDatasets = await Promise.all(
    datasets.map(async (dataset) => {
      await takeOverDataset(accessToken, sourceWorkspaceId, dataset.id);

      const updateDetails = {
        /* Your update details here */
      };
      return await updateDatasource(
        accessToken,
        sourceWorkspaceId,
        dataset.id,
        updateDetails
      );
    })
  );

  return updatedDatasets;
}

/**
 * Perform CI/CD process by cloning all reports in parallel and updating data sources for all datasets.
 */
async function performCICD() {
  try {
    const accessToken = await fetchPowerBIAccessToken(
      clientId,
      clientSecret,
      tenantId
    );

    if (!accessToken) {
      console.error("Failed to fetch access token");
      return;
    }

    const reports = await listReports(accessToken, sourceWorkspaceId);
    const datasets = await listDatasets(accessToken, sourceWorkspaceId);

    if (!reports || !datasets) {
      console.error("Failed to fetch reports or datasets");
      return;
    }

    // Clone all reports in parallel, 10 at a time
    const clonedReports = await cloneReportsInParallel(
      accessToken,
      reports.value
    );
    console.log("Cloned reports:", clonedReports);

    // Update data sources for all datasets
    const updatedDatasets = await takeOverAndUpdateDataSources(
      accessToken,
      datasets.value
    );
    console.log("Updated datasets:", updatedDatasets);
  } catch (error) {
    console.error("Error performing CI/CD:", error);
  }
}

performCICD();


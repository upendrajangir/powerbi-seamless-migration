require("dotenv").config();
const fs = require("fs");
const { fetchPowerBIAccessToken } = require("./src/modules/powerbiAuth.js");
const {
  getPowerBiWorkspaces,
  createWorkspace,
} = require("./src/modules/workspaces.js");
const {
  getReport,
  listReports,
  exportPowerBIReport,
  importPbixToWorkspace,
} = require("./src/modules/reports.js");
const {
  takeOverDataset,
  updateDatasource,
} = require("./src/modules/datasets.js");

const clientId = process.env.AZURE_APP_ID;
const clientSecret = process.env.AZURE_APP_SECRET;
const tenantId = process.env.AZURE_TENANT_ID;
const sourceWorkspaceId = process.env.SOURCE_WORKSPACE_ID;
const targetWorkspaceId = process.env.TARGET_WORKSPACE_ID;
const targetWorkspaceName = process.env.TARGET_WORKSPACE_NAME;
const nameConflict = "CreateOrOverwrite";
const targetDatasourceDetails = {
  updateDetails: [
    {
      connectionDetails: {
        server: process.env.TARGET_DATABASE_SERVER,
        database: process.env.TARGET_DATABASE_NAME,
      },
    },
  ],
};

async function performCICD() {
  try {
    // 1. Generate an access token
    const accessToken = await fetchPowerBIAccessToken(
      clientId,
      clientSecret,
      tenantId
    );

    // 2. Create a workspace if not exists using source workspace configuration and specified targetWorkspaceName
    let workspaces = await getPowerBiWorkspaces(accessToken);

    // const sourceWorkspace = workspaces.find((w) => w.id === sourceWorkspaceId);
    // let targetWorkspace = workspaces.find((w) => w.id === targetWorkspaceId);

    const sourceWorkspace = workspaces.filter(function (workspace) {
      return workspace.id == sourceWorkspaceId;
    })[0];
    let targetWorkspace = workspaces.filter(function (workspace) {
      return workspace.id == targetWorkspaceId;
    })[0];

    if (!targetWorkspace) {
      targetWorkspace = await createWorkspace(
        (accessToken = accessToken),
        (isReadOnly = sourceWorkspace.isReadOnly),
        (isOnDedicatedCapacity = sourceWorkspace.isOnDedicatedCapacity),
        (capacityId = sourceWorkspace.capacityId),
        (workspaceName = targetWorkspaceName)
      );
    }

    // 3. List all reports
    const reports = await listReports(accessToken, sourceWorkspaceId);

    // 4. Loop through all reports and for each report in source workspace
    for (const report of reports) {
      // a. Export a pbix file
      const pbixFile = await exportPowerBIReport(
        accessToken,
        sourceWorkspaceId,
        report.id,
        `./${report.name}.pbix`
      );

      // b. Import pbix to target workspace with the same display name as the source
      const importedReport = await importPbixToWorkspace(
        accessToken,
        targetWorkspaceId,
        pbixFile,
        report.name,
        nameConflict
      );
      // c. Takeover new created data source
      let targetWorkspaceReports = await listReports(
        accessToken,
        targetWorkspaceId
      );
      let importedReportData = targetWorkspaceReports.filter(function (entity) {
        return entity.name == report.name;
      })[0];

      const dataset = await takeOverDataset(
        accessToken,
        targetWorkspaceId,
        importedReportData.datasetId
      );
      // d. Update dataset's datasource connection
      const updatedDatasource = await updateDatasource(
        accessToken,
        targetWorkspaceId,
        importedReportData.datasetId,
        targetDatasourceDetails
      );

      // e. Delete the pbix file
      fs.unlinkSync(pbixFile);
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

performCICD();
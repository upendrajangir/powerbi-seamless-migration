const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

/**
 * Gets Power BI report in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace to list reports from.
 * @param {string} reportId - ID of the report to get.
 * @returns {Promise<void>}
 */
async function getReport(accessToken, workspaceId, reportId) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error: No response received from the server", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error:", error.message);
    }
  }
}

/**
 * Lists Power BI reports in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace to list reports from.
 * @returns {Promise<void>}
 */
async function listReports(accessToken, workspaceId) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.request(config);
    return response.data.value;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error: No response received from the server", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error:", error.message);
    }
  }
}

/**
 * Clones a Power BI report from one workspace to another.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} sourceWorkspaceId - ID of the workspace containing the report to be cloned.
 * @param {string} reportId - ID of the report to be cloned.
 * @param {string} targetWorkspaceId - ID of the workspace to clone the report into.
 * @param {string} targetModelId - ID of the dataset to be used in the cloned report.
 * @param {string} reportName - Name of the cloned report.
 * @returns {Promise<void>}
 */
async function cloneReport(
  accessToken,
  sourceWorkspaceId,
  reportId,
  targetWorkspaceId,
  targetModelId,
  reportName
) {
  const data = JSON.stringify({
    name: reportName,
    targetModelId: targetModelId,
    targetWorkspaceId: targetWorkspaceId,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${sourceWorkspaceId}/reports/${reportId}/Clone`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error: No response received from the server", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error:", error.message);
    }
  }
}

/**
 * Exports a Power BI report using the specified access token, workspace ID, and report ID.
 * @param {string} accessToken - Power BI access token
 * @param {string} workspaceId - Workspace ID containing the report
 * @param {string} reportId - Report ID to be exported
 * @param {string} outputFilePath - Output file path for the exported report
 * @returns {Promise<boolean>} - Resolves with true if the report is exported successfully, otherwise false
 */
async function exportPowerBIReport(
  accessToken,
  workspaceId,
  reportId,
  outputFilePath
) {
  const apiUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/Export`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "arraybuffer",
    });

    if (response.status === 200) {
      fs.writeFileSync(outputFilePath, response.data);
      console.log(`Report exported successfully to ${outputFilePath}`);
      return outputFilePath;
    } else {
      console.log("Failed to export report");
      return false;
    }
  } catch (error) {
    console.error(
      "Error exporting report:",
      error.response ? error.response.data.toString() : error
    );
    return false;
  }
}

/**
 * Imports a PBIX file to a Power BI workspace.
 * @param {string} accessToken - The access token to authenticate with the Power BI API.
 * @param {string} targetWorkspaceId - The ID of the target workspace.
 * @param {string} pbixFilePath - The file path of the PBIX file to import.
 */
async function importPbixToWorkspace(
  accessToken,
  targetWorkspaceId,
  pbixFilePath,
  datasetDisplayName,
  nameConflict
) {
  try {
    // Import the exported report to the target workspace
    console.log("Importing report to target workspace...");
    const formData = new FormData();
    const readStream = fs.createReadStream(pbixFilePath);
    formData.append("file", readStream);

    const response = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/groups/${targetWorkspaceId}/imports?datasetDisplayName=${encodeURIComponent(
        datasetDisplayName
      )}&nameConflict=${nameConflict}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log(
      `PBIX file imported successfully. Import ID: ${response.data.id}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Error:", error.response.status, error.response.data);
      if (error.response.status === 400) {
        console.log(
          "Error details:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error: No response received from the server", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error:", error.message);
    }
  }
}

/**
 * Deletes a report from the specified workspace.
 * @param {string} accessToken - The access token to authenticate with the Power BI API.
 * @param {string} workspaceId - The ID of the workspace containing the reports.
 * @param {string} reportId - The ID of the report to delete.
 */
async function deleteReport(accessToken, workspaceId, reportId) {
  // Define the API URL for the report in the specified workspace
  const apiUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;

  // Set the request headers with the access token
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Send a DELETE request to the API to delete the specified report
  try {
    await axios.delete(apiUrl, { headers });
    console.log(`Deleted report with ID '${reportId}'`);
  } catch (error) {
    console.error(
      `Error deleting report with ID '${reportId}':`,
      error.response.data
    );
  }
}

/**
 * Deletes all reports from the specified workspace.
 * @param {string} accessToken - The access token to authenticate with the Power BI API.
 * @param {string} workspaceId - The ID of the workspace containing the reports.
 */
async function deleteAllReports(accessToken, workspaceId) {
  // Define the API URL for the reports in the specified workspace
  const apiUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`;

  // Set the request headers with the access token
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Send a GET request to the API to retrieve the reports in the workspace
  const response = await axios.get(apiUrl, { headers });

  // Loop through each report in the response and delete it
  for (const report of response.data.value) {
    const deleteUrl = `${apiUrl}/${report.id}`;
    await axios.delete(deleteUrl, { headers });
    console.log(`Deleted report '${report.name}' with ID '${report.id}'`);
  }
}

module.exports = {
  getReport,
  listReports,
  cloneReport,
  exportPowerBIReport,
  importPbixToWorkspace,
  deleteReport,
  deleteAllReports,
};

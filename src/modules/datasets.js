const axios = require("axios");

/**
 * Lists Power BI datasets in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace to list datasets from.
 * @returns {Promise<void>}
 */
async function listDatasets(accessToken, workspaceId) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets`,
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
 * Takes over a Power BI dataset in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace containing the dataset.
 * @param {string} datasetId - ID of the dataset to take over.
 * @returns {Promise<void>}
 */
async function takeOverDataset(accessToken, workspaceId, datasetId) {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/Default.TakeOver`,
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
 * Update the data sources of a Power BI dataset in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace containing the dataset.
 * @param {string} datasetId - ID of the dataset to update the data sources for.
 * @param {Object} updateDetails - The new data source details.
 * @returns {Promise<void>}
 */
async function updateDatasource(
  accessToken,
  workspaceId,
  datasetId,
  updateDetails
) {
  const data = JSON.stringify({ updateDetails });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/Default.updateDatasource`,
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
 * Deletes all datasets in a given Power BI workspace.
 * @param {string} accessToken - Access token for the Power BI API.
 * @param {string} workspaceId - ID of the workspace containing the datasets.
 */
async function deleteAllDatasets(accessToken, workspaceId) {
  const apiUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await axios.get(apiUrl, { headers });

  // Iterate through all datasets in the workspace and delete them one by one
  for (const dataset of response.data.value) {
    const deleteUrl = `${apiUrl}/${dataset.id}`;
    await axios.delete(deleteUrl, { headers });
    console.log(`Deleted dataset '${dataset.name}' with ID '${dataset.id}'`);
  }
}

module.exports = {
  listDatasets,
  takeOverDataset,
  updateDatasource,
  deleteAllDatasets,
};

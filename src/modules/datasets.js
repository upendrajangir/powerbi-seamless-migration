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
 * Refreshes a Power BI dataset in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace containing the dataset.
 * @param {string} datasetId - ID of the dataset to refresh.
 * @returns {Promise<void>}
 */
async function refreshDataset(accessToken, workspaceId, datasetId) {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/refreshes`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      notifyOption: "NoNotification",
      retryCount: 1,
    }),
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

const axios = require("axios");

/**
 * Fetches the refresh schedule of a Power BI dataset in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace containing the dataset.
 * @param {string} datasetId - ID of the dataset to fetch the refresh schedule for.
 * @returns {Promise<void>}
 */
async function getRefreshSchedule(accessToken, workspaceId, datasetId) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/refreshSchedule`,
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

const axios = require("axios");

/**
 * Updates the refresh schedule of a Power BI dataset in a workspace.
 * @param {string} accessToken - Access token for Power BI API.
 * @param {string} workspaceId - ID of the workspace containing the dataset.
 * @param {string} datasetId - ID of the dataset to update the refresh schedule for.
 * @param {object} refreshSchedule - An object containing the refresh schedule data.
 * @returns {Promise<object>} - Returns the response data as an object.
 */
async function updateRefreshSchedule(
  accessToken,
  workspaceId,
  datasetId,
  refreshSchedule
) {
  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/refreshSchedule`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(refreshSchedule),
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

// write a function to rename a powerbi dataset



/**
 * Deletes a dataset from the specified workspace.
 * @param {string} accessToken - The access token to authenticate with the Power BI API.
 * @param {string} workspaceId - The ID of the workspace containing the dataset.
 * @param {string} datasetId - The ID of the dataset to delete.
 */
async function deleteDataset(accessToken, workspaceId, datasetId) {
  // Define the API URL for the dataset in the specified workspace
  const apiUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}`;

  // Set the request headers with the access token
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Send a DELETE request to the API to delete the specified dataset
  try {
    await axios.delete(apiUrl, { headers });
    console.log(`Deleted dataset with ID '${datasetId}'`);
  } catch (error) {
    console.error(
      `Error deleting dataset with ID '${datasetId}':`,
      error.response.data
    );
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

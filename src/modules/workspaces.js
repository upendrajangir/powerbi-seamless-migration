const axios = require("axios");
const { deleteAllDashboards } = require("./dashboards");
const { deleteAllReports } = require("./reports");
const { deleteAllDatasets } = require("./datasets");
const { access } = require("fs");

/**
 * Get Power BI groups using the provided access token.
 * @param {string} accessToken The access token to authenticate the API requests.
 * @throws Will throw an error if the API request fails.
 */
async function getPowerBiWorkspaces(accessToken) {
  try {
    console.log("Fetching Power BI groups...");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.powerbi.com/v1.0/myorg/groups/",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      console.log("Power BI groups fetched successfully");
      return response.data.value;
    } else {
      console.error(
        `Error fetching Power BI groups: Unexpected status code ${response.status}`
      );
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error fetching Power BI groups: ${error.message} (Status code: ${error.response.status})`
      );
    } else if (error.request) {
      console.error(`Error fetching Power BI groups: No response received`);
      console.error("Request:", error.request);
    } else {
      console.error(`Error fetching Power BI groups: ${error.message}`);
    }

    // Rethrow the error to propagate it to the calling code
    throw error;
  }
}

/**
 * Create a Power BI workspace with the specified settings.
 * @param {string} accessToken The access token to authenticate the API requests.
 * @param {boolean} isReadOnly Specifies if the workspace should be read-only.
 * @param {boolean} isOnDedicatedCapacity Specifies if the workspace should be on a dedicated capacity.
 * @param {number} capacityId The ID of the capacity for the workspace.
 * @param {string} workspaceName The name of the new workspace.
 * @throws Will throw an error if the API request fails.
 */
async function createWorkspace(
  accessToken,
  isReadOnly,
  isOnDedicatedCapacity,
  capacityId,
  workspaceName
) {
  try {
    console.log(`Creating workspace '${workspaceName}'...`);

    const axios = require("axios");
    const data = {
      isReadOnly: isReadOnly,
      isOnDedicatedCapacity: isOnDedicatedCapacity,
      capacityId: capacityId,
      type: "Workspace",
      name: workspaceName,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.powerbi.com/v1.0/myorg/groups?workspaceV2=True",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      console.log(`Workspace '${workspaceName}' created successfully`);
      return response.data;
    } else {
      console.error(
        `Error creating workspace '${workspaceName}': Unexpected status code ${response.status}`
      );
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error creating workspace '${workspaceName}': ${error.message} (Status code: ${error.response.status})`
      );
    } else if (error.request) {
      console.error(
        `Error creating workspace '${workspaceName}': No response received`
      );
      console.error("Request:", error.request);
    } else {
      console.error(
        `Error creating workspace '${workspaceName}': ${error.message}`
      );
    }

    // Rethrow the error to propagate it to the calling code
    throw error;
  }
}

/**
 * Get Power BI capacities using the provided access token.
 * @param {string} accessToken The access token to authenticate the API requests.
 * @throws Will throw an error if the API request fails.
 */
async function getPowerBiCapacities(accessToken) {
  try {
    console.log("Fetching Power BI capacities...");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.powerbi.com/v1.0/myorg/capacities",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      response.data;
      console.log("Power BI capacities fetched successfully");
    } else {
      console.error(
        `Error fetching Power BI capacities: Unexpected status code ${response.status}`
      );
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error fetching Power BI capacities: ${error.message} (Status code: ${error.response.status})`
      );
    } else if (error.request) {
      console.error(`Error fetching Power BI capacities: No response received`);
      console.error("Request:", error.request);
    } else {
      console.error(`Error fetching Power BI capacities: ${error.message}`);
    }

    // Rethrow the error to propagate it to the calling code
    throw error;
  }
}

/**
 * Add a user to the specified Power BI workspace.
 * @param {string} accessToken The access token to authenticate the API requests.
 * @param {Object} userData An object containing user data, such as emailAddress, groupUserAccessRight, displayName, identifier, and principalType.
 * @throws Will throw an error if the API request fails.
 */
async function addUserToPowerBiWorkspace(accessToken, userData) {
  try {
    console.log(`Adding user '${userData.displayName}' to the workspace...`);

    let data = JSON.stringify(userData);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.powerbi.com/v1.0/myorg/groups/3cef33e3-8d6d-477c-b94d-1a51c967e9c0/users",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      console.log(
        `User '${userData.displayName}' added to the workspace successfully`
        );
        return response.data;
    } else {
      console.error(
        `Error adding user '${userData.displayName}' to the workspace: Unexpected status code ${response.status}`
      );
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error adding user '${userData.displayName}' to the workspace: ${error.message} (Status code: ${error.response.status})`
      );
    } else if (error.request) {
      console.error(
        `Error adding user '${userData.displayName}' to the workspace: No response received`
      );
      console.error("Request:", error.request);
    } else {
      console.error(
        `Error adding user '${userData.displayName}' to the workspace: ${error.message}`
      );
    }

    // Rethrow the error to propagate it to the calling code
    throw error;
  }
}

/**
 * Assign a Power BI workspace to a capacity.
 * @param {string} accessToken The access token to authenticate the API requests.
 * @param {string} workspaceId The ID of the workspace to assign to the capacity.
 * @param {string} capacityId The ID of the capacity to assign the workspace to.
 * @throws Will throw an error if the API request fails.
 */
async function assignWorkspaceToCapacity(accessToken, workspaceId, capacityId) {
  try {
    console.log(
      `Assigning workspace '${workspaceId}' to capacity '${capacityId}'...`
    );

    const axios = require("axios");
    const data = JSON.stringify({
      capacityId: capacityId,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/AssignToCapacity`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data;

    console.log(
      `Workspace '${workspaceId}' assigned to capacity '${capacityId}' successfully`
    );
  } catch (error) {
    if (error.response) {
      console.error(
        `Error assigning workspace '${workspaceId}' to capacity '${capacityId}': ${error.message} (Status code: ${error.response.status})`
      );
    } else if (error.request) {
      console.error(
        `Error assigning workspace '${workspaceId}' to capacity '${capacityId}': No response received`
      );
      console.error("Request:", error.request);
    } else {
      console.error(
        `Error assigning workspace '${workspaceId}' to capacity '${capacityId}': ${error.message}`
      );
    }

    // Rethrow the error to propagate it to the calling code
    throw error;
  }
}

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
  getPowerBiWorkspaces,
  createWorkspace,
  addUserToPowerBiWorkspace,
  getPowerBiCapacities,
  assignWorkspaceToCapacity,
  cleanWorkspace,
};

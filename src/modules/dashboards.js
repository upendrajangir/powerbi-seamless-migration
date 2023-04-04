const axios = require("axios");

/**
 * Deletes all dashboards from a given Power BI workspace using the Power BI REST API.
 *
 * @param {string} accessToken - The access token for the Power BI API.
 * @param {string} workspaceId - The ID of the Power BI workspace to delete the dashboards from.
 * @returns {Promise<void>} - A Promise that resolves when all dashboards have been deleted.
 */
async function deleteAllDashboards(accessToken, workspaceId) {
  // Construct the API URL for getting all dashboards in the workspace.
  const apiUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/dashboards`;

  // Set the headers for the API request with the access token.
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Make the API request to get all dashboards in the workspace.
  const response = await axios.get(apiUrl, { headers });

  // Loop through each dashboard in the response and delete it using the API.
  for (const dashboard of response.data.value) {
    const deleteUrl = `${apiUrl}/${dashboard.id}`;
    await axios.delete(deleteUrl, { headers });
    console.log(
      `Deleted dashboard '${dashboard.displayName}' with ID '${dashboard.id}'`
    );
  }
}

module.exports = {
  deleteAllDashboards,
};

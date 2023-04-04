const axios = require("axios");
const qs = require("qs");

/**
 * Fetches an access token for Power BI API.
 * @param {string} clientId - Power BI client ID
 * @param {string} clientSecret - Power BI client secret
 * @param {string} tenantId - Azure tenant ID
 * @returns {Promise<string | null>} - Resolves with access token if successful, otherwise null
 */
async function fetchPowerBIAccessToken(clientId, clientSecret, tenantId) {
  const data = qs.stringify({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    resource: "https://analysis.windows.net/powerbi/api",
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://login.microsoftonline.com/${tenantId}/oauth2/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response ? JSON.stringify(error.response.data, null, 2) : error
    );
    return null;
  }
}

module.exports = { fetchPowerBIAccessToken };

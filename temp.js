const fs = require("fs");
const powerBI = require("./src/modules/reports.js");
const FormData = require("form-data");
const axios = require("axios");

const accessToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTRlMzQwMzgtZWExZi00ODgyLWI2ZTgtY2NkNzc2NDU5Y2EwLyIsImlhdCI6MTY4MDU3ODk5MSwibmJmIjoxNjgwNTc4OTkxLCJleHAiOjE2ODA1ODI4OTEsImFpbyI6IkUyWmdZTGpwZVdqQ3lpYnZpTSszSm54Ty9pczZDUUE9IiwiYXBwaWQiOiJmNmE5MTJkNy01YjgxLTRlMDMtYjAyNC1iNzVhMzcwZTVmNmEiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lNGUzNDAzOC1lYTFmLTQ4ODItYjZlOC1jY2Q3NzY0NTljYTAvIiwib2lkIjoiNjllYjY4OTYtMzBiYi00ZjFkLWE5OWUtM2RjZWMxZTBlMzk2IiwicmgiOiIwLkFVa0FPRURqNUJfcWdraTI2TXpYZGtXY29Ba0FBQUFBQUFBQXdBQUFBQUFBQUFCSkFBQS4iLCJzdWIiOiI2OWViNjg5Ni0zMGJiLTRmMWQtYTk5ZS0zZGNlYzFlMGUzOTYiLCJ0aWQiOiJlNGUzNDAzOC1lYTFmLTQ4ODItYjZlOC1jY2Q3NzY0NTljYTAiLCJ1dGkiOiJXRVg0emkya3ZrS3Z6YnpLMl9HWEFBIiwidmVyIjoiMS4wIn0.N5GBmEY3FFv6rggbB6A_RRax2YvJ4LPhX2GDxdGJ2Mzm-E2Imqo9lYjfUryh8soeF4PFjUSUHK05hoQXIKUVGrfitP4Wiy5hpO6Jfxv0oMwB6buh0bhSH5qDYj1uu1_IUdcQdyd7NKc1GtYvxtJGawnVH8eq-hwkHyeLnQsKenjcAYniNvTx0lo_vRnuAuub_AJdXK1dcEhlv-yKnC07iO51n9dSxqOI7WGWCnAwsRTLLITjaoQjhFcdHkuL9qxu0aMx8ji-AUbcqxgJORT8dtRnfzbeRxZKw1pGwOziI-fENByVkaAyrgD6fYDbIPZeqvMWN_E7VLZ2Q9JqajaZng";
const sourceWorkspaceId = "8d3ed401-5ab8-4303-917e-50937051712a";
const targetWorkspaceId = "2ac8d40f-6178-422b-b273-99e16cf09841";
const reportId = "e7f6f0a2-2d44-4139-9dc7-7e04c6b25ef5";
const datasetDisplayName = "Test Dataset 2";
const exportFileName = "report.pbix";

(async () => {
    try {
      // Export the report from the source workspace
      console.log("Exporting report...");
      const exportedReportPath = `./${exportFileName}`;
      const exportResult = await powerBI.exportPowerBIReport(
        accessToken,
        sourceWorkspaceId,
        reportId,
        exportedReportPath
      );
  
      if (!exportResult) {
        console.error("Failed to export report.");
        return;
      }
  
      // Import the exported report to the target workspace
      console.log("Importing report to target workspace...");
      const formData = new FormData();
      const readStream = fs.createReadStream(exportedReportPath);
      formData.append("file", readStream);
  
      const response = await axios.post(
        `https://api.powerbi.com/v1.0/myorg/groups/${targetWorkspaceId}/imports?datasetDisplayName=${encodeURIComponent(datasetDisplayName)}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...formData.getHeaders(),
          },
        }
      );
  
      if (response.status === 202) {
        console.log("Report import started successfully.");
      } else {
        console.log("Failed to start report import.");
        console.log(response.data);
      }
  
      // Cleanup: Remove the exported report file
      fs.unlinkSync(exportedReportPath);
    } catch (error) {
      console.error("Error importing report:", error.response ? error.response.data : error);
      console.log("Failed to import report.");
    }
  })();
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "google-service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1FgEX9qE5CKy6xIE7blhB0bPcsW4zFMLeoMZ7-4B0fgw";

async function addToSheet(doc) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        
        doc.agent || "",
        doc.eventName || "",
        doc.name || "",
        doc.email || "",
        doc.phone || "",
        doc.institutionId || "",
        doc.college || ""
      ]]
    }
  });
}

module.exports = addToSheet;

const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1FgEX9qE5CKy6xIE7blhB0bPcsW4zFMLeoMZ7-4B0fgw";

async function addToSheet(doc) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:G",
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

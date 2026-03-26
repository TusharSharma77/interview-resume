const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const app = require('./src/app');
const connectDB = require('./src/config/database');
connectDB();


(async () => {
  try {
    const report = await generateInterviewReport({ resume, selfDescription, jobDescription });
    console.log("Gemini report generated:", report);
  } catch (err) {
    console.error("Gemini generation failed:", err?.message || err);
  }
})();

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});
import axios from "axios";

const interviewApi = axios.create({
  baseURL: "http://localhost:3000/api/interview",
  withCredentials: true,
});

export async function generateInterviewReport({
  jobDescription,
  selfDescription,
  file,
}) {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("file", file);

  const response = await interviewApi.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

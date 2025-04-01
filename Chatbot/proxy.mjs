// filepath: c:\Users\HP\Documents\EDULABS\Chatbot\proxy.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import the CORS middleware

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.get("/solve", async (req, res) => {
  const { problem } = req.query;
  const appId = "9KLJWW-527Q5E6J7A"; // Replace with your Wolfram Alpha API key
  const encodedProblem = encodeURIComponent(problem);
  const url = `https://api.wolframalpha.com/v2/query?input=${encodedProblem}&format=plaintext&output=JSON&appid=${appId}&podstate=Step-by-step solution`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.queryresult && data.queryresult.success) {
      const pods = data.queryresult.pods;
      const solutionPod = pods.find(
        (pod) =>
          pod.title === "Result" ||
          pod.title === "Exact result" ||
          pod.title === "Step-by-step solution"
      );
      if (solutionPod) {
        res.json({ solution: solutionPod.subpods[0].plaintext });
      } else {
        res.json({ solution: "Solution not found." });
      }
    } else {
      res.json({ solution: "Unable to solve the problem." });
    }
  } catch (error) {
    console.error("Error fetching from Wolfram Alpha:", error);
    res.status(500).json({ error: "Failed to fetch solution" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

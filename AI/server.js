const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies with increased limit for image data
app.use(bodyParser.json({ limit: "50mb" }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Newton API endpoints for different operations
const NEWTON_BASE_URL = "https://newton.now.sh/api/v2";
const OPERATIONS = {
  simplify: "/simplify/",
  factor: "/factor/",
  derive: "/derive/",
  integrate: "/integrate/",
  zeroes: "/zeroes/",
  tangent: "/tangent/",
  area: "/area/",
  cos: "/cos/",
  sin: "/sin/",
  tan: "/tan/",
  arccos: "/arccos/",
  arcsin: "/arcsin/",
  arctan: "/arctan/",
  abs: "/abs/",
  log: "/log/",
};

// Helper function to determine which operation to use
function determineOperation(problem) {
  problem = problem.toLowerCase();

  if (problem.includes("solve") || problem.includes("=")) {
    return "simplify"; // For equations
  } else if (problem.includes("factor") || problem.includes("factorise")) {
    return "factor";
  } else if (problem.includes("derivative") || problem.includes("derive")) {
    return "derive";
  } else if (problem.includes("integrate") || problem.includes("integral")) {
    return "integrate";
  } else if (problem.includes("zero") || problem.includes("root")) {
    return "zeroes";
  } else if (problem.includes("tangent")) {
    return "tangent";
  } else if (problem.includes("area")) {
    return "area";
  } else if (problem.includes("cos")) {
    return "cos";
  } else if (problem.includes("sin")) {
    return "sin";
  } else if (problem.includes("tan")) {
    return "tan";
  } else if (problem.includes("arccos")) {
    return "arccos";
  } else if (problem.includes("arcsin")) {
    return "arcsin";
  } else if (problem.includes("arctan")) {
    return "arctan";
  } else if (problem.includes("abs")) {
    return "abs";
  } else if (problem.includes("log")) {
    return "log";
  } else {
    // Default to simplify for basic arithmetic
    return "simplify";
  }
}

// Helper function to clean up the problem for the API
function cleanProblem(problem) {
  // Remove operation keywords
  const keywords = [
    "solve",
    "factor",
    "factorise",
    "derivative",
    "derive",
    "integrate",
    "integral",
    "zero",
    "root",
    "tangent",
    "area",
    "cos",
    "sin",
    "tan",
    "arccos",
    "arcsin",
    "arctan",
    "abs",
    "log",
  ];

  let cleaned = problem;
  keywords.forEach((keyword) => {
    cleaned = cleaned.replace(new RegExp(keyword, "gi"), "");
  });

  // Replace × with * and ÷ with /
  cleaned = cleaned.replace(/×/g, "*").replace(/÷/g, "/");

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

// Helper function to generate step-by-step solution
function generateSteps(operation, problem, result) {
  const steps = [];

  // Basic arithmetic
  if (operation === "simplify") {
    if (problem.includes("+")) {
      const parts = problem.split("+").map((p) => p.trim());
      steps.push(`First, we need to add ${parts[0]} and ${parts[1]}.`);
      steps.push(`${parts[0]} + ${parts[1]} = ${result}`);
    } else if (problem.includes("-")) {
      const parts = problem.split("-").map((p) => p.trim());
      steps.push(`First, we need to subtract ${parts[1]} from ${parts[0]}.`);
      steps.push(`${parts[0]} - ${parts[1]} = ${result}`);
    } else if (problem.includes("*")) {
      const parts = problem.split("*").map((p) => p.trim());
      steps.push(`First, we need to multiply ${parts[0]} and ${parts[1]}.`);
      steps.push(`${parts[0]} × ${parts[1]} = ${result}`);
    } else if (problem.includes("/")) {
      const parts = problem.split("/").map((p) => p.trim());
      steps.push(`First, we need to divide ${parts[0]} by ${parts[1]}.`);
      steps.push(`${parts[0]} ÷ ${parts[1]} = ${result}`);
    } else if (problem.includes("=")) {
      // Simple equation solving
      const parts = problem.split("=").map((p) => p.trim());
      steps.push(`We need to solve the equation ${parts[0]} = ${parts[1]}.`);
      steps.push(`Rearranging to isolate the variable.`);
      steps.push(`The solution is ${result}`);
    } else {
      steps.push(`We need to simplify the expression ${problem}.`);
      steps.push(`The simplified result is ${result}`);
    }
  }
  // Factoring
  else if (operation === "factor") {
    steps.push(`We need to factor the expression ${problem}.`);
    steps.push(`The factored form is ${result}`);
  }
  // Derivatives
  else if (operation === "derive") {
    steps.push(`We need to find the derivative of ${problem}.`);
    steps.push(`Using the rules of differentiation.`);
    steps.push(`The derivative is ${result}`);
  }
  // Integration
  else if (operation === "integrate") {
    steps.push(`We need to integrate the expression ${problem}.`);
    steps.push(`Using the rules of integration.`);
    steps.push(`The integral is ${result} + C`);
  }
  // Finding zeros/roots
  else if (operation === "zeroes") {
    steps.push(`We need to find the zeros of the function ${problem}.`);
    steps.push(`Setting the expression equal to zero and solving.`);
    steps.push(`The zeros are at x = ${result}`);
  }
  // Other operations
  else {
    steps.push(`We need to calculate ${operation} of ${problem}.`);
    steps.push(`The result is ${result}`);
  }

  return steps;
}

// Endpoint to solve math problems
app.post("/api/solve-math", async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem) {
      return res.status(400).json({ error: "Problem is required" });
    }

    // Determine which operation to use
    const operation = determineOperation(problem);

    // Clean up the problem for the API
    const cleanedProblem = cleanProblem(problem);

    // Encode the problem for URL
    const encodedProblem = encodeURIComponent(cleanedProblem);

    console.log(
      `Calling Newton API: ${NEWTON_BASE_URL}${OPERATIONS[operation]}${encodedProblem}`
    );

    // Call the Newton API
    const response = await axios.get(
      `${NEWTON_BASE_URL}${OPERATIONS[operation]}${encodedProblem}`
    );

    // Extract the result
    const result = response.data.result;

    // Generate step-by-step solution
    const steps = generateSteps(operation, cleanedProblem, result);

    res.json({
      problem: problem,
      steps: steps,
      answer: result,
    });
  } catch (error) {
    console.error("Error solving math problem:", error);
    res.status(500).json({
      error: "Failed to solve math problem",
      details: error.message,
    });
  }
});

// Simple OCR-like functionality for image math problems
// Note: This is a simplified mock version since we're not using paid APIs
app.post("/api/process-math-image", async (req, res) => {
  try {
    // In a real implementation, we would use an OCR service here
    // For now, we'll just return a mock response

    // Mock extraction of a math problem from the image
    const mockProblem = "3x + 5 = 20";

    // Now solve this problem using our math solver
    const operation = "simplify";

    // Mock solution steps
    const steps = [
      "First, we need to isolate the variable term by subtracting 5 from both sides.\n3x + 5 - 5 = 20 - 5\n3x = 15",
      "Next, we divide both sides by 3 to find the value of x.\n3x ÷ 3 = 15 ÷ 3\nx = 5",
    ];

    res.json({
      problem: mockProblem,
      steps: steps,
      answer: "x = 5",
    });
  } catch (error) {
    console.error("Error processing math image:", error);
    res.status(500).json({ error: "Failed to process math image" });
  }
});

// Serve the main HTML file for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

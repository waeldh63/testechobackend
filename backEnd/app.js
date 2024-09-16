const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const config = require("./config");
const port = config.port;

const userService = require("./services/UserService");
const {
  getRecordsWithPagination,
  runSearch,
} = require("./services/myTableService");

app.get("/users", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/userLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);

    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/records", async (req, res) => {
  const { page = 1, limit = 30 } = req.query;

  try {
    const records = await getRecordsWithPagination(
      parseInt(page, 10),
      parseInt(limit, 10)
    );
    res.json(records);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching records." });
  }
});

app.get("/search", async (req, res) => {
  const { firstname } = req.query;

  if (!firstname) {
    return res
      .status(400)
      .json({ error: 'Query parameter "firstname" is required' });
  }

  try {
    const results = await runSearch(firstname);
    res.json(results);
    return results
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: "An error occurred while searching" });
  }
});
app.post("/createUser", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const user = await userService.createUser(name, password, email);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

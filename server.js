const { app } = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`App is currently running on port ${PORT}`);
});

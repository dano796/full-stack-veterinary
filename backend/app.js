const express = require("express");
const usersRouter = require("./routes/users");
const petsRouter = require("./routes/pets");
const appointmentsRouter = require("./routes/appointments");
const examsRouter = require("./routes/exams");
const paymentsRouter = require("./routes/payments");
const corsMiddleware = require("./middlewares/cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.disable("x-powered-by");

app.use("/users", usersRouter);
app.use("/pets", petsRouter);
app.use("/appointments", appointmentsRouter);
app.use("/exams", examsRouter);
app.use("/payments", paymentsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

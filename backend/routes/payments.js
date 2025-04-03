const express = require("express");
const PaymentController = require("../controllers/payment.js");

const paymentsRouter = express.Router();

paymentsRouter.post("/", PaymentController.createPayment);
paymentsRouter.get("/:id", PaymentController.getPaymentById);

module.exports = paymentsRouter;

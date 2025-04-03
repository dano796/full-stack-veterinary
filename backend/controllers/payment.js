const PaymentModel = require("../models/payment");

class PaymentController {
  static async createPayment(req, res) {
    try {
      const { user_id, amount } = req.body;
      const newPayment = await PaymentModel.createPayment(user_id, amount);
      res.status(201).json(newPayment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPaymentById(req, res) {
    try {
      const payment = await PaymentModel.findById(req.params.id);
      if (!payment)
        return res.status(404).json({ message: "Payment not found" });
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PaymentController;

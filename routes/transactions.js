const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const { amount, transaction_type, user } = req.body;
    const transaction = new Transaction({ amount, transaction_type, user });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve all transactions for a specific user
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    const transactions = await Transaction.find({ user: user_id });
    res.status(200).json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve a specific transaction by ID
router.get("/:transaction_id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transaction_id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update the status of a transaction
router.put("/:transaction_id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["COMPLETED", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transaction_id,
      { status },
      { new: true }
    );

    if (!updatedTransaction) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

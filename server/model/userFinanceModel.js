 import mongoose from "mongoose";

const UserFinanceSchema = new Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true 
    },
  income: {
    salary: Number,
    monthly: [Number],
    yearly: [Number]
  },
  expenses: {
    monthly: [Number],
    yearly: [Number]
  },
  investments: {
    totalInvestment: Number,
    safeProportion: Number,
    stockProportion: Number
  }
});

export default mongoose.model("UserFinance", UserFinanceSchema);
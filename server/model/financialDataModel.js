import mongoose from 'mongoose';

const financialDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  basics: {
    currentAge: Number,
    retirementAge: Number,
    wishToLiveTill: Number,
    inflation: { type: Number, default: 6 },
    capitalGainTax: { type: Number, default: 20 },
    incomeTax: { type: Number, default: 30 }
  },
  income: {
    sources: [{
      name: String,
      amount: Number,
      frequency: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' }
    }],
    totalYearlyIncome: Number
  },
  expenses: {
    monthly: [{
      name: String,
      amount: Number,
      category: { type: String, enum: ['Needs', 'Business', 'Wants'], default: 'Needs' }
    }],
    yearly: [{
      name: String,
      amount: Number,
      category: String
    }],
    totalYearlyExpense: Number,
    monthlyExcess: Number,
    yearlyExcess: Number
  },
  investments: {
    totalInvestmentsPerMonth: Number,
    safeAssetProportion: { type: Number, default: 0 },
    stockMarketAssetProportion: { type: Number, default: 100 },
    safeAssets: {
      vpf: { percentage: Number, return: { type: Number, default: 7 } },
      fixedDeposit: { percentage: Number, return: { type: Number, default: 7 } },
      governmentBills: { percentage: Number, return: { type: Number, default: 7 } },
      gold: { percentage: Number, return: { type: Number, default: 7 } },
      corporateBonds: { percentage: Number, return: { type: Number, default: 7 } }
    },
    stockMarketAssets: {
      largecapMutualFund: { 
        percentage: Number, 
        lowReturn: { type: Number, default: 12 },
        highReturn: { type: Number, default: 40 }
      },
      directStocks: { 
        percentage: Number, 
        lowReturn: { type: Number, default: 10 },
        highReturn: { type: Number, default: 35 }
      },
      smallcapMutualFund: { 
        percentage: Number, 
        lowReturn: { type: Number, default: 18 },
        highReturn: { type: Number, default: 25 }
      }
    },
    blendedReturn: Number,
    stepUpSavings: { type: Number, default: 5 }
  },
  financialPlanning: {
    projections: [{
      age: Number,
      startingSaving: Number,
      plannedExpenses: Number,
      additionalExpenses: Number,
      additionalSavings: Number,
      endingSavings: Number,
      status: String,
      warning: String
    }]
  },
  investmentMatrix: {
    ageRanges: [{
      range: String, // "20-30", "30-40", "40+"
      largecap: Number,
      directStocks: Number,
      smallcap: Number
    }]
  },
  lastUpdated: { type: Date, default: Date.now }
});

const FinancialData = mongoose.model('FinancialData', financialDataSchema);
export default FinancialData;
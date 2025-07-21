import FinancialData from "../model/financialDataModel.js";

export const getFinancialData = async (req, res) => {
  try {
    const financialData = await FinancialData.findOne({ userId: req.user.userId });
   
   console.log(financialData,"financialData", );
    if (!financialData) {
      // Return default structure if no data exists
      return res.json({
        basics: { inflation: 6, capitalGainTax: 20, incomeTax: 30 },
        income: { sources: [], totalYearlyIncome: 0 },
        expenses: { monthly: [], yearly: [], totalYearlyExpense: 0 },
        investments: {
          safeAssetProportion: 0,
          stockMarketAssetProportion: 100,
          stepUpSavings: 5,
          safeAssets: {},
          stockMarketAssets: {}
        },
        financialPlanning: { projections: [] },
        investmentMatrix: { ageRanges: [] }
      });
    }
    res.status(200).json({success:true,message:"Finance data fetched successfully",data:financialData});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const updateFinancialData = async (req, res) => {
  try {
    const existingData = await FinancialData.findOne({ userId: req.user.userId });
    console.log(existingData, "existingData");
    
    if (existingData) {
      // Update existing data
      Object.assign(existingData, req.body);
      existingData.lastUpdated = new Date();
      await existingData.save();
      res.json(existingData);
    } else {
      // Create new data
      const financialData = new FinancialData({
        userId: req.user.userId,
        ...req.body
      });
      await financialData.save();
      res.status(201).json(financialData);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

}
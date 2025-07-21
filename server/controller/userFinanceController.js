import projectionModel from "../model/projectionModel.js";
import userModel from "../model/userModel.js";

export const calculateUserFinance =  async(req, res) => {
  try {
    const userId = req.user.id;
    const userDetail = await userModel.findById(userId);
    if (!userDetail) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      currentAge, retirementAge, endAge,
      currentSavings, monthlyInvestment, stepUpRate,
      assetAllocations, inflationRate, desiredMonthlyPostRetirementAmount
    } = req.body;

    const projection = [];
    let savings = currentSavings;
    let monthlyInvestmentCurrent = monthlyInvestment;

    for (let age = currentAge; age <= endAge; age++) {
      const isRetired = age >= retirementAge;
      let additional = isRetired ? 0 : monthlyInvestmentCurrent * 12;
      let returnRate = assetAllocations.reduce(
        (acc, asset) => acc + asset.return * asset.share * (1 - asset.tax), 0
      );

      let expenses = isRetired
        ? desiredMonthlyPostRetirementAmount * 12 * Math.pow(1 + inflationRate, age - retirementAge)
        : 0;

      let endSavings = (savings + additional - expenses) * (1 + returnRate);

      projection.push({
        age, starting: savings, additional, expenses,
        ending: endSavings, status: isRetired ? (endSavings > 0 ? 'Retired' : 'Dead') : 'Saving'
      });

      savings = endSavings;
      if (!isRetired) monthlyInvestmentCurrent *= (1 + stepUpRate);
    }

    // Save to DB
    const newProjection = new projectionModel({
      userId,
      inputs: req.body,
      results: projection
    });

    await newProjection.save();

    res.status(201).send({success:true, message: 'Projection saved successfully', data:projection });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
}

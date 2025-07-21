import FinancialData from "../model/financialDataModel.js";
import userModel from "../model/userModel.js";
export const getAllUsers= async (req, res) => {
  try {
    const users = await userModel.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json({succe:true, message:"Users fetched successfully", data:users});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const getAllFinancialData = async (req, res) => {
  try {
    const financialData = await FinancialData.find({})
      .populate('userId', 'email firstName lastName')
      .sort({ lastUpdated: -1 });
    res.status(200).json({success:true,data:financialData, message:"Financial data fetched successfully"});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    await FinancialData.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

  export const defaultAdmin = async (req, res) => {
  try {    
    const existingAdmin = await userModel.find();
    if (existingAdmin.length > 0) {
        console.log("User already created"); 
      return ;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);
    
    const admin = new User({
    firstName: 'Top Admin',
    lastName: '',
      email:"admin@gmail.com",
      password: hashedPassword,
      role: 'admin',
      profile: { firstName: 'Admin', lastName: 'User' }
    });

    await admin.save();
     res.status(200).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
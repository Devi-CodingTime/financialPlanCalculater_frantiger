    import mongoose, { Schema } from "mongoose";

    const userSchema = new Schema({ 
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: { 
            type: String,
            required: true,
        },
        role: { 
            type: String, 
            enum: ['admin', 'user'], 
            default: 'user' 
        },
        mobile: { 
            type: String,
            default: "",
        },
    }, { timestamps: true });

    // Export the User model
    export default mongoose.model("User", userSchema);



// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const UserSchema = new mongoose.Schema({
//   phone: { type: String, required: true, unique: true },
//   name: { type: String },
//   password: { type: String, required: true }, 
// });

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// UserSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model("User", UserSchema);
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true }, 
});

UserSchema.pre("save", async function (next) {
  console.log("Pre-save hook triggered for user:", this.phone); // Added log
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hashing."); // Added log
    return next();
  }
  try {
    console.log("Hashing password..."); 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error during password hashing:", error); 
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
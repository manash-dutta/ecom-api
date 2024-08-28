import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name can't be greater than 25 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        // return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message:
        "Password should be between 8-12 charachetrs and have a special character",
    },
  },
  type: { type: String, enum: ["Customer", "Seller"] },
});

// // Pre-save middleware to hash the password before saving
// userSchema.pre('save', async function (next) {
//   const user = this;

//   // Only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) return next();

//   try {
//     // Generate a salt and hash the password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// export const UserModel = mongoose.model("User", userSchema);
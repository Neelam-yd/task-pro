import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
  try {
    // connect DB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // clear old users
    await User.deleteMany({});

    // hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // insert users
    await User.insertMany([
      {
        name: "Rahul",
        email: "rahul@gmail.com",
        password: hashedPassword,
        role: "Developer",
      },
      {
        name: "Amit",
        email: "amit@gmail.com",
        password: hashedPassword,
        role: "Admin",
      },
    ]);

    console.log("Users seeded successfully");
    process.exit();
  } catch (err) {
    console.log("Seed error:", err);
    process.exit(1);
  }
};

seedUsers();
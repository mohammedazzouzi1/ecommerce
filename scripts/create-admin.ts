import { connectDB } from "../lib/mongodb";
import Admin from "../models/Admin";

async function createDefaultAdmin() {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }
    
    // Create default admin
    const admin = await Admin.create({
      username: "admin",
      password: "Azzouzi2024!",
      role: "superadmin",
    });
    
    console.log("Admin created successfully!");
    console.log("Username: admin");
    console.log("Password: Azzouzi2024!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createDefaultAdmin();

import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/:phone", async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.params.phone });
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
  const { phone, name, password } = req.body;

  try {
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: "User Already exists" });
    }
    user = new User({ phone, name, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req,res)=>{
    const {name}=req.body;
    try {
        let user= await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        if(name){
            user.name=name;
        }
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
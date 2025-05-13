const { User, validate } = require("../model/userModel");
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const Joi = require("joi");

const createUser = asyncHandler(async (req, res) => {
  try {
    const { error } = validate(req.body); // ✅ fixed here
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  try {
    const { error } = validat(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send({ message: "Invalid email or password" });

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged in successfully",name: user.firstName + " "+user.lastName,userkey:user._id });

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const testUser = asyncHandler(async (req, res) => {
  try {
    res.send("Welcome Harish");
  } catch (error) {
    res.status(500).send({ message: "Unable to get" });
  }
});
const getUserDetail = asyncHandler(async(req, res) =>{
  try {
      const {id} = req.params;
      const userdetails = await User.findById(id);
      res.status(200).json(userdetails);
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
});

const validat = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	
	return schema.validate(data);
};

module.exports = { createUser, authUser, testUser,getUserDetail };

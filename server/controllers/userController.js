const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input!",
    });
  }

  const user = await User.findOne({ email: email });

  if (user) {
    throw new Error(`Email has already existed!`);
  } else {
    const NewUser = await User.create(req.body);

    return res.status(200).json({
      success: NewUser ? true : false,
      mes: NewUser ? 'Register is Successfully! Please login!' : 'Something went Wrong!',
    });
  }
});

//###########################

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password ) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input!",
    });
  }

  const user = await User.findOne({ email: email });
  // console.log(user.isCorrectPassword(password))
  if (user && await user.isCorrectPassword(password)) {
    const { password, role, ...userData} = user.toObject()
    console.log('Login Success!')
    return res.status(200).json({
      success: true,
      mes: 'Login success!',
      userData
    })
  } else {
    console.log('Login failed!')
    throw new Error(`Invalid credentials!`);
  }
});

module.exports = { register,login };

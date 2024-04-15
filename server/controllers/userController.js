const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");

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
      mes: NewUser
        ? "Register is Successfully! Please login!"
        : "Something went Wrong!",
    });
  }
});

//###########################
// Refresh Token => reCreate access Token
// Access Token => xac thuc nguoi dung va phan quyen
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input!",
    });
  }

  const user = await User.findOne({ email: email });
  // console.log(user.isCorrectPassword(password))
  if (user && (await user.isCorrectPassword(password))) {
    // tach password va role ra khoi return dataUser
    const { password, role, ...userData } = user.toObject();

    // create accessToken
    const accessToken = generateAccessToken(user._id, role);
    // create refreshToken
    const refreshToken = generateRefreshToken(user._id);
    // statement save refreshToken to Database
    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
    // statement save refreshToken to Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      mes: "Login success!",
      accessToken,
      userData,
    });
  } else {
    throw new Error(`Invalid credentials!`);
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id).select("-refreshToken -password -role");

  return res.status(200).json({
    success: false,
    rs: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get Token from cookies
  const cookie = req.cookies;
  // check token exist
  if (!cookie && !cookie.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  
  // check token co hop le khong
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    succes: response ? true : false,
    newAccessToken: response
      ? generateAccessToken({ _id: response._id, role: response.role })
      : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req , res) => {
  const cookie = req.cookies

  if (!cookie || !cookie.refreshToken) throw new Error('No refresh Token in cookie')
  // xoa column refreshToken trong db
  await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new : true})
  // xoa refreshToken o cookie trinh duyet
  res.clearCookie('refreshToken',{
    httpOnly: true,
    secure: true
  })

  return res.status(200).json({
    success: true,
    mes: 'Logout Success!'
  })
})

module.exports = { register, login, getCurrentUser, refreshAccessToken , logout};

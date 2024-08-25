const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const makeToken = require("uniqid");

// const register = asyncHandler(async (req, res) => {
//   const { email, password, firstname, lastname } = req.body;

//   if (!email || !password || !firstname || !lastname) {
//     return res.status(400).json({
//       success: false,
//       mes: "Missing Input!",
//     });
//   }

//   const user = await User.findOne({ email: email });

//   if (user) {
//     throw new Error(`Email has already existed!`);
//   } else {
//     const NewUser = await User.create(req.body);

//     return res.status(200).json({
//       success: NewUser ? true : false,
//       mes: NewUser
//         ? "Register is Successfully! Please login!"
//         : "Something went Wrong!",
//     });
//   }
// });

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;

  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input!",
    });
  }

  const user = await User.findOne({ email: email });
  if (user) {
    throw new Error(`Email has already existed!`);
  } else {
    const token = makeToken();
    // lưu cookie
    res.cookie(
      "dataRegister",
      { ...req.body, token },
      {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      }
    );

    const html = `Please Click Link bottom to complete process register. Link will expired then 15 minutes since now! 
  <a href = ${process.env.URL_SERVER}/api/user/finalregister/${token} >Click here!</a>`;

    const data = {
      email,
      html,
      subject: "Complete process register!",
    };

    await sendMail(data);
    return res.json({
      succes: true,
      mes: "Please check your email to active account",
    });
  }
});

const finalRegister = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);

  const { token } = req.params;
  if (!cookie || cookie?.dataRegister?.token !== token)
    return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`);

  const NewUser = await User.create({
    email: cookie?.dataRegister?.email,
    password: cookie?.dataRegister?.password,
    mobile: cookie?.dataRegister?.mobile,
    firstname: cookie?.dataRegister?.firstname,
    lastname: cookie?.dataRegister?.lastname,
  });

  if (NewUser) {
    return res.redirect(`${process.env.URL_CLIENT}/finalregister/success`);
  } else {
    return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`);
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
    const { password, role, refreshToken, ...userData } = user.toObject();

    // create accessToken
    const accessToken = generateAccessToken(user._id, role);
    // create refreshToken
    const newRefreshToken = generateRefreshToken(user._id);
    // statement save refreshToken to Database
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // statement save refreshToken to Cookie
    res.cookie("refreshToken", newRefreshToken, {
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
    success: user ? true : false,
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

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh Token in cookie");
  // xoa column refreshToken trong db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // xoa refreshToken o cookie trinh duyet
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    success: true,
    mes: "Logout Success!",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing Email!");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User Not Found!");

  const resetToken = user.createPasswordChangedToken();
  // save để cập nhật lưu trong db
  await user.save();

  const html = `Please Click Link bottom to change your password. Link will expired then 15 minutes since now! <a href = ${process.env.URL_CLIENT}/api/user/reset-password/${resetToken} >Click here!</a>`;

  const data = {
    email,
    html,
    subject: "Forgot password",
  };

  const rs = await sendMail(data);
  return res.status(200).json({
    success: rs ? true : false,
    mes: "Check Your Email!",
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new Error("Missing input");
  const passwordResetToken = crypto.createHash("sha256").update(token).digest();
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset Token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpired = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "something went Wrong",
  });
});

// Admin Permission
const getAllUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");

  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing inputs");
  const response = await User.findByIdAndDelete(_id);

  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} is deleted`
      : "User Not Found",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role");

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "User Not Found",
  });
});

const updatedUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!uid || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "User Not Found",
  });
});

const updatedUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing Input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    {
      new: true,
    }
  ).select("-password -role -refreshToken");

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "User Not Found",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing Input");

  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "User Not Found",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        {
          $push: { cart: { product: pid, quantity, color } },
        },
        { new: true }
      );

      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "User Not Found",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quantity, color } },
      },
      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "User Not Found",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateUser,
  updatedUserByAdmin,
  updatedUserAddress,
  updateCart,
  finalRegister,
};

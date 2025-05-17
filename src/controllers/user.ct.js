import { User } from "../models/user.mo.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  console.log("This is req body", name, email, username, password);
  const existingUser = await User.findOne({
    $or: [{ username, email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username alreafdy exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImage = req.files?.coverimg[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(500, "No Local Path found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    name,
    email,
    username,
    password,
    avatar: avatar?.url,
  });

  const createdUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ username, email }],
  });

  const correctPassword = await user.isPasswordCorrect(password);
  if (!correctPassword) {
    throw new ApiError(401, "Passowrd is incorrect");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggedInUser = User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", loggedInUser.accessToken, options)
    .cookie("refreshToken", loggedInUser.refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "Login Successfull"));
});


const logoutUser = asyncHandler(async()=>{

  
})
export { registerUser, loginUser , logoutUser};

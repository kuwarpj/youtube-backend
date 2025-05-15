import { User } from "../models/user.mo.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username, email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username alreafdy exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImage = req.files?.coverimg[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(500, "No Local Path found");
  }

const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    name,
    email,
    username: username.toLowercase(),
    password,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully"));
});

export { registerUser };

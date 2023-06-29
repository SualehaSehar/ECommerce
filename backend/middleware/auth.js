const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401)); //401 Unauthorized
  }

  // Verify and decode the token on the server-side
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // user id was saved in token as payload, now id is decoded from token and getting the rest info of the user from db
  req.user = await User.findById(decodedData.id);  
  
  next();

});

const authorizeRoles =  (...roles) => {
  return (req,res,next)=>{
     if(!roles.includes(req.user.role)){  //for admin
      return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403)); //403 Forbidden
     }
     next();
  };
};

module.exports.isAuthenticatedUser = isAuthenticatedUser;
module.exports.authorizeRoles = authorizeRoles;

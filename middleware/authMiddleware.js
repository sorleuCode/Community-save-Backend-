const jwt = require('jsonwebtoken');
require('dotenv')
const Admin = require("../models/AdminModel");

const verifyToken = async (req, res, next) => {

  const authHeader = req.headers["authorization"] || req.headers["Authorization"];


  if (authHeader && authHeader.startsWith("Bearer")) {

    try {

      const token = authHeader.split(" ")[1];
      console.log(token)
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }

      const decoded =   jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

      console.log(decoded)

      req.user = await Admin.findById(decoded.id).select("-password");
      console.log(req.user)
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, only admin can create Thrifts" });
      }
      next();


    }

    catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    } 
    
  }
    else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
}

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin resource. Access denied' });
  next();
};

module.exports = { verifyToken, isAdmin };
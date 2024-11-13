const Users = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "Email already registered" });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password should be of atleast 6 characters" });

      const hashpassword = await bcrypt.hash(password, 10);

      const newUser = new Users({
        name,
        email,
        password: hashpassword,
      });

      await newUser.save();

      const accessToken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({ accessToken });
    } catch (err) {
      console.log(err);
    }
  },
  refreshtoken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please re register or login" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please re register or login e" });

        const accesstoken = createAccessToken({ id: user.id });
        res.json({user,accesstoken})
      });
    } catch (err) {
      return res.status(500).json({msg:err.message})
    }
  },
  login: async (req,res) => {
    try {
      const {email,password} = req.body

      const user = await Users.findOne({email})
      if(!user) return res.status(404).json({msg:"User not found"})

      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) return res.status(404).json({msg:"incorrect password"})
      
      const accessToken = createAccessToken({id:user._id})
      const refreshtoken = createRefreshToken({id:user._id})

      res.cookie('refreshtoken',refreshtoken, {
        httpOnly:true,
        path:'/user/refresh_token'
      })

      res.json(accessToken)
    } catch(err) {

    }
  },
  logout: async (req,res) => {
    try{
      res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
      return res.json({msg:'Logout'})
    }catch(err) {

    }
  },
  getUser: async (req,res) => {
    try{
      const user = await Users.findById(req.user.id).select('-password')
      if(!user) return res.status(400).json({msg: "User not found"})
      
      res.json(user)
    }catch(err) {
      
    }
  }
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;

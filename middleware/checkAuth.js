import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const checkAuth = async (req, res, next)=>{
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startWith('Bearer')
    ){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);

            req.user = await User.findById(decoded.id).select("-password -confirmed -token -createdAt -updatedAt -__v");
            return next();

        } catch (error) {
            return res.status(404).json({ msg: "ERROR" });
        }
    }
    
    if(!token){
        const error = new Error("Token not valid");
        return res.status(401).json({ msg:  error.message});
    }
    
    next();

    // //read token from header
    //const token = req.header('x-auth-token')

    // //check if no token
    // if(!token) {
    //     res.status(401).json({ msg: "Invalid permission " })
    // }

    // //validate token
    // try {
    //     const encrypted = jwt.verify(token, process.env.SECRET);
    //     // add verify user to request object
    //     req.user = encrypted.user;
    //     next();

    // } catch(error) {
    //     res.status(404).json({ msg: "Token not valid" });
    // }
};

export default checkAuth;
import jwt from "jsonwebtoken";

function jwtToken({user_id,user_email,user_password}){
    const user={user_id,user_email,user_password};
    const accessToken =jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1m'})
    const refreshToken =jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'5m'})
    return ({accessToken,refreshToken})
}

export {jwtToken}
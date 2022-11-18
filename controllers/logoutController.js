const User = require('../model/User')
const handleLogout = async (req, res) => {
    // On client, delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) 
    return res.sendStatus(204);
    const refreshToken = cookies.jwt

    // is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser){
        res.clearCookie('jwt', {httpOnly: true});
         return res.sendStatus(204);
    }
    //delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result)


    res.clearCookie('jwt', {httpOnly: true}); //secure: true - pnly serves on https
    res.sendStatus(204);

}
module.exports = {handleLogout}

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    //check if username or password has been input
    if (!user || !pwd) 
    return res.status(400).json({'message': 'Username and Password required'});

    //check if user exists
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); //unauthorized

    //check password input if user found
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        res.json({'success' : `user ${user} is logged in!`})
    } else {
        res.sendStatus(401);
    } 
}

module.exports = {handleLogin}

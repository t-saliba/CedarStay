const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res, next) => {
    try {
    const { email, username, password } = req.body;
    const user = new User ({email, username});
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Cedar Stay');
        res.redirect('/hotels');
    })

    } catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

// passport.authenticate() allow us to specify the strategy. It could be facebook or twitter 
//failure flash to flash a message automatically
// failureRedirect: if something goes wrong redirect to login
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/hotels';
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}






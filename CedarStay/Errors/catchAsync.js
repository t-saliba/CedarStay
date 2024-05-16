/*This code helps manage errors in Express routes by automatically catching and passing any 
errors that occur during asynchronous operations to the Express error-handling middleware.
which is app.use(err, req, res, next) */

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}
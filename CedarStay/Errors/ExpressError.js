/*It's used to create custom error objects with specific
 messages and status codes for better error handling in Express.js applications.*/

 class ExpressError extends Error {
    constructor (message, statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
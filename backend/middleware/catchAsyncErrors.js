//this is exporting a higher-order function. It takes theFunc as an argument and returns a middleware function
//it is to deal eith catch situation, e.g if required fields are not provided
module.exports = theFunc => (req,res,next) => {
    Promise.resolve(theFunc(req,res,next)).catch(next); //next here goes to product model and send the required error as response
}
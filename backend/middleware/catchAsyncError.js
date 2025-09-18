export const catchAsyncError = (theFunction) => {
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next);              // if promise is not resolved then it will call the 'next' i.e. errorMiddleware will be executed
    };
};
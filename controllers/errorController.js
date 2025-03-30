const errorController = {};

/**
 * Intentionally throws an error to test the 500 error handler.
 */
errorController.triggerError = (req, res, next) => {
    try {
        throw new Error("This is a test 500 error.");
    } catch (error) {
        next(error); // Pass the error to Express error handling middleware
    }
};

module.exports = errorController;

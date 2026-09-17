

export const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err.code === '23505') {
        return res.status(409).json({
            message: "The username already exists!"
        });
    }

    res.status(500).json({
        message: "Internal server error!"
    });
};
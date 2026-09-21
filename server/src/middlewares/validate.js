
export const validate = (schema) => {
    return (req, res, next) => {
        // console.log(req.body);
        const result = schema.safeParse(req.body);
// console.log(result);
// console.log(result.error);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: result.error.flatten().fieldErrors,
            });
        }
        req.body = result.data;
        next();
    };
}
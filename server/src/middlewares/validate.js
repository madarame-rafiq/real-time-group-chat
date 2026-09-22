
export const validate = (schema, source="body") => {
    return (req, res, next) => {
        // console.log(req.body);
        const result = schema.safeParse(req[source]);
console.log(result);
console.log(result.error);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: result.error.flatten().fieldErrors,
            });
        }
        if (source === "query") {
            req.validatedQuery = result.data;
        } else {
            req.body = result.data;
        }
        next();
    };
}
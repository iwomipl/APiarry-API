import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {}

export const handleError =(err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);

    res
        .status(err instanceof ValidationError ? 400 : 500)
        .render('error', {
            message: err instanceof ValidationError ? err.message : `We're sorry, try again later.`,
        });
}

export const handleFourOhFourError = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404);

    if (req.accepts('html')) {
        res.render('error', {
            message: 'Page does not exist.',
        });
        return;
    }

    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
}
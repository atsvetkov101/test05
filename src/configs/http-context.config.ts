import httpContext from 'express-http-context';
import { NextFunction, Request, Response } from 'express';

export const getHttpContextConfig =	() => (request: Request, response: Response, next: NextFunction) => {
	httpContext.ns.bindEmitter(request);
	httpContext.ns.bindEmitter(response);
	return next();
};

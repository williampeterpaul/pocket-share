import { getSession } from 'next-auth/client'

export function initMiddleware(middleware) {
    return (req, res) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result)
                }
                return resolve(result)
            })
        })
}

export function validateMiddleware(validations, validationResult) {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)))

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        console.error(errors);

        res.status(422).json({ error: 'Validation errors' })
    }
}

export function requireAuthentication() {
    return async (req, res, next) => {
        const session = await getSession({ req });

        if (session) {
            req['session'] = session;

            return next()
        }

        res.status(403).json({ error: 'User underprivileged' });
    }
}
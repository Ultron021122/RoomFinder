import { getSession } from 'next-auth/react';

export function withAuth(handler, allowedRoles) {
    return async (req, res) => {
        const session = await getSession({ req });

        if (!session || !allowedRoles.includes(session.user.roleid)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        return handler(req, res);
    };
}
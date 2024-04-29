export const errorsMap = {
    '42P01': {
        message: 'Table not found',
        status: 404,
    },
    'ECONNREFUSED': {
        message: 'Connection refused',
        status: 503,
    },
    '23505': {
        message: 'Duplicate key',
        status: 409,
    },
    '23503': {
        message: 'Foreign key violation',
        status: 409,
    },
    '22P02': {
        message: 'Invalid text representation',
        status: 400,
    }
};
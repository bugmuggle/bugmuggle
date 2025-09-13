export const ERR_RESPONSE_UNAUTHORIZED: ServerErrObject = Object.freeze({ statusCode: 403, statusMessage: 'Unauthorized' })

export const ERR_RESPONSE_ACCOUNT_NOT_FOUND: ServerErrObject = Object.freeze({ statusCode: 404, statusMessage: 'Account not found' })
export const ERR_RESPONSE_ACCOUNT_ALREADY_EXISTS: ServerErrObject = Object.freeze({ statusCode: 409, statusMessage: 'Account already exists' })

export const ERR_RESPONSE_PROJECT_UNAUTHORIZED_ACCESS: ServerErrObject = Object.freeze({ statusCode: 403, statusMessage: `You don't have permission to access the project` })
export const ERR_RESPONSE_PROJECT_ALREADY_MEMBER: ServerErrObject = Object.freeze({ statusCode: 409, statusMessage: 'User is already member of the project' })
export const ERR_RESPONSE_PROJECT_ADMIN_ONLY_OPERATION: ServerErrObject = Object.freeze({ statusCode: 403, statusMessage: 'Only an admin can perform this operation.' })

export const ERR_RESPONSE_WORKITEM_NOT_FOUND: ServerErrObject = Object.freeze({ statusCode: 404, statusMessage: 'Work item not found' })

export const ERR_RESPONSE_BAD_REQUSET: ServerErrObject = Object.freeze({ statusCode: 400, statusMessage: 'Bad request' })
export const ERR_RESPONSE_INTERNAL_SERVER_ERROR: ServerErrObject = Object.freeze({ statusCode: 500, statusMessage: 'Internal server error' })
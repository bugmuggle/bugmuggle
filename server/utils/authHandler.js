export const defineAuthEventHandler = (handler) => {
  return defineEventHandler(async (event) => {
    try {
      const session = await getUserSession(event)
      if (!session || !session.user) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Unauthorized request'
        })
      }

      const response = await handler(event)
      return response
    } catch (err) {
      console.log(err)
      if (err.statusCode) {
        throw err
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error'
        })
      }
    }
  })
}

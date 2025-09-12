import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event)

    if (user?.email) {
      event.context.user = user
      return
    }

    const authHeader = getRequestHeader(event, 'authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length).trim()
      const { jwtSecret } = useRuntimeConfig(event)

      if (jwtSecret && token) {
        try {
          const decoded = jwt.verify(token, jwtSecret) as { sub?: string; email?: string }
          if (decoded?.email) {
            event.context.user = {
              id: decoded.sub,
              email: decoded.email
            }
          }
        } catch {
          // ignore invalid token; user will remain unauthenticated
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
})

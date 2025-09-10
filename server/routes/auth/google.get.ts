import { eq } from "drizzle-orm"

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    const db = useDrizzle()

    let queryUser = (await db.select()
      .from(tables.users)
      .where(eq(tables.users.email, user.email))
      .limit(1)
    )?.[0]

    if (!queryUser) {
      const newUserQuery = await db.insert(tables.users).values({
        email: user.email
      }).returning()

      queryUser = newUserQuery?.[0] ?? null
    }

    await setUserSession(event, {
      user: {
        id: queryUser.id,
        email: queryUser.email
      }
    })

    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
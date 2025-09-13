import { eq } from "drizzle-orm"

export default defineAuthHandler(async (event) => {
  const db = event.context.db
  const user = event.context.user

  const [queryUser] = await db.select()
    .from(tables.users)
    .where(eq(tables.users.email, user.email))
    .limit(1)

  if (!queryUser) {
    await clearUserSession(event)
    return createError({ statusCode: 403, statusMessage: 'Unauthorized' })
  }

  const queryPref: UserPref[] = await db.select()
    .from(tables.userPref)
    .where(eq(tables.userPref.userId, queryUser.id))

  const lastVisitedProjectId: string | boolean | number | null = getPrefByKey(
    queryPref,
    prefKeys.LAST_VISITED_PROJECT_ID,
    null
  )

  if (!lastVisitedProjectId) {
    const [queryFirstProject] = await db.select()
      .from(tables.projects)
      .where(eq(tables.projects.createdBy, user.id))
      .limit(1)

    if (queryFirstProject) {
      const [newPref] = await db.insert(tables.userPref)
        .values({
          userId: user.id,
          pref: {
            key: prefKeys.LAST_VISITED_PROJECT_ID,
            value: queryFirstProject.id
          }
        })
        .returning()

      queryPref.push(newPref)
    }
  }
  
  return {
    profile: queryUser,
    pref: queryPref
  }
})

import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineAuthHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      if (!event.context?.user?.email) {
        return createError({ statusCode: 403, statusMessage: 'Unauthorized' })
      }

      event.context.db = useDrizzle()

      return await handler(event)
    } catch (error) {
      return createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error'
      })
    }
  })

import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineAuthHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      if (!event.context?.user?.email) {
        return createError(ERR_RESPONSE_UNAUTHORIZED)
      }

      event.context.db = useDrizzle()

      return await handler(event)
    } catch (error) {
      console.error(error)
      return createError(ERR_RESPONSE_INTERNAL_SERVER_ERROR)
    }
  })

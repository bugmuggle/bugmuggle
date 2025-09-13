export default defineEventHandler(async (event) => {
  event.context.db = useDrizzle()
})

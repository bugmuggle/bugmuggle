export default defineEventHandler(async (event) => {
  try {
    return true
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})
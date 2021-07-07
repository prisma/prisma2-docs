const { PrismaClient } = require('@prisma/client')

const client = new PrismaClient()

exports.handler = async function(event, context, callback) {
  const body = JSON.parse(event.body)
  if (!body.pageUrl) {
    throw new Error(`Please provide a pageUrl`)
  }

  if (!body.sentiment) {
    throw new Error(`Please provide a sentiment`)
  }

  if (!['Happy', 'Unhappy'].includes(body.sentiment)) {
    throw new Error(`Please provide "Happy" or "Unhappy" as the sentiment`)
  }
  const pageUrl = stripTrailingSlash(body.pageUrl)

  const feedback = await client.feedback.create({
    data: {
      pageUrl,
      ip: event.headers['x-forwarded-for'],
      userAgent: event.headers['user-agent'],
      sentiment: body.sentiment,
    },
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      id: feedback.id
    }),
  }
}

function stripTrailingSlash(url) {
  return url.replace(/\/$/, '')
}

const app = require('./app') // load the express app from app.js
const logger = require('./utils/logger') // info and error logging

app.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`)
})
module.exports = (body) => {
    return !!(body.prodTitle + body.price + body.description)
}
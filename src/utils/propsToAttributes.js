function propsToAttributes(props) {
    return Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
  }
  
  module.exports = { propsToAttributes };
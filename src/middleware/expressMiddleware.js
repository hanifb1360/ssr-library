function ssrMiddleware(generateHTML) {
    return (req, res) => {
      const html = generateHTML();
      res.send(html);
    };
  }
  
  module.exports = { ssrMiddleware };
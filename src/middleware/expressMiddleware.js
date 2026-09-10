function ssrMiddleware(generateHTML) {
  if (typeof generateHTML !== "function") {
    throw new TypeError("ssrMiddleware requires a render function.");
  }

  return (req, res, next) => {
    const handleError = (error) => {
      if (typeof next === "function") {
        return next(error);
      }

      throw error;
    };

    const sendHTML = (html) => {
      if (typeof html !== "string") {
        throw new TypeError("SSR render function must return a string.");
      }

      return res.send(html);
    };

    try {
      const result = generateHTML(req);

      if (result && typeof result.then === "function") {
        return Promise.resolve(result)
          .then(sendHTML)
          .catch(handleError);
      }

      return sendHTML(result);
    } catch (error) {
      return handleError(error);
    }
  };
}

module.exports = { ssrMiddleware };

function defaultProcess() {
  try {
    console.log('성공 send');
  } catch (error) {
    console.error('error send', error);
  }
}


class API {
  #app = null;

  init(app) {
    this.#app = app;
  }

  //#createAPIHandlers(authLevel) {
  //  return {
  //    get: (path) => {
        
  //    }
  //  }
  //}

  #checkAppIsNotNull() {
    if (this.#app === null) {
      throw new Error('app is null');
    }
  }

  #divideMiddlewareAndFnExecute(...args) {
    if (args.length === 0) {
      throw new Error('divideMiddlewareAndFnExecute - args.length 0');
    }

    const middlewares = args.slice(0, args.length - 1);
    const fnExcute = args[args.length - 1];

    return { middlewares, fnExcute };
  }

  // Auth
  user() {
    
  }

  admin() {
    
  }

  // Method
  get(path, ...args) {
    this.#checkAppIsNotNull();

    const { middlewares, fnExcute } = this.#divideMiddlewareAndFnExecute(...args);

    this.#app.get(path, ...middlewares, async (req, res) => {
      await fnExcute(req, res);
    });
  }
}

const api = new API();

export default api;
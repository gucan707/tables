export class TError extends Error {
  constructor(msg: string, status: number) {
    super(JSON.stringify({ msg, status }));
  }
}

export class TErrorToken extends TError {
  constructor() {
    super("未登录或登录状态异常，请重新登录", 401);
  }
}

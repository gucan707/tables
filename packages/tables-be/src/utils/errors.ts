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

export class TErrorTablePermission extends TError {
  constructor() {
    super("您无权限对该表格做此操作", 401);
  }
}

export class TErrorPageError extends TError {
  constructor() {
    super("page 格式不正确", 400);
  }
}

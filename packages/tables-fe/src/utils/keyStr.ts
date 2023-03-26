export enum KeyStr {
  ArrowLeft = "ArrowLeft",
  ArrowUp = "ArrowUp",
  ArrowRight = "ArrowRight",
  ArrowDown = "ArrowDown",
  End = "End",
  Home = "Home",
  Delete = "Delete",
  Backspace = "Backspace",
  A = "a",
  C = "c",
  V = "v",
}

/**
 * 检查当前按键是否会影响光标位置
 * @param key 按键 e.key
 * @returns 返回 true 表示会影响
 */
export function checkMoveCursorKey(key: string) {
  return (
    key === KeyStr.ArrowDown ||
    key === KeyStr.ArrowLeft ||
    key === KeyStr.ArrowRight ||
    key === KeyStr.ArrowUp
  );
}

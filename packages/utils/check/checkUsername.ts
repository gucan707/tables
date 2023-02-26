/**
 * 校验用户名
 * @param name 昵称
 * @returns 返回字符串或 null，字符串为昵称不合法的原因，null 表示昵称合法
 */
export function checkUsername(name: string): string | null {
  if (!name.length) return "昵称不得为空";
  const formatName = name.trim();
  if (!formatName.length) return "昵称不可均为空白字符";
  if (formatName !== name) return "昵称前后不可包含空白字符";
  if (name.length > 10) return "昵称不得超过10个字符";
  return null;
}

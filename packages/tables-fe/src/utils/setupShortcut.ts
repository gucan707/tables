import { KeyStr } from "./keyStr";

export type SetupShortcutProps = {
  e: React.KeyboardEvent<HTMLTextAreaElement>;
  setText: React.Dispatch<React.SetStateAction<string>>;
};
export function setupShortcut(props: SetupShortcutProps) {
  const { e, setText } = props;
  if (!e.metaKey && !e.ctrlKey) return;
  console.log("e.metaKey", e.key);

  let shouldPreventDefault = true;

  const target = e.target as HTMLInputElement;
  switch (e.key) {
    case KeyStr.A:
    case KeyStr.C:
    case KeyStr.V:
      shouldPreventDefault = false;
      break;
    default:
      break;
  }
  shouldPreventDefault && e.preventDefault();
}

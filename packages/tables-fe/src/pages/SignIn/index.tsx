import { FC } from "react";
import { Input } from "@arco-design/web-react";

export const SignIn: FC = () => {
  return (
    <div>
      <div>Tables</div>
      <Input
        style={{ width: 350 }}
        allowClear
        placeholder="Please Enter something"
      />
    </div>
  );
};

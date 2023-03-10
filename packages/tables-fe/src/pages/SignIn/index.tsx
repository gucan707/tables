import { FC } from "react";
import { Button, Form, Input, Tabs } from "@arco-design/web-react";
import "./index.scss";
import { useSignIn } from "./hooks/useSignIn";
import { useSignUp } from "./hooks/useSignUp";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

export const SignIn: FC = () => {
  const { setSignInInfo, signInInfo } = useSignIn();
  const { errorMsg, setName, setPw, setRepeatPw, signUpInfo } = useSignUp();

  return (
    <div className="sign">
      <h1 className="sign-header">Tables</h1>
      <Tabs className="sign-tabs" defaultActiveTab="1">
        <TabPane key="1" title="登录">
          <Form className="sign-tabs-form" autoComplete="off">
            <FormItem label="用户名">
              <Input
                value={signInInfo.name}
                onChange={(e) => setSignInInfo({ ...signInInfo, name: e })}
                placeholder="请输入用户名"
              />
            </FormItem>
            <FormItem label="密码">
              <Input.Password
                value={signInInfo.pw}
                onChange={(e) => setSignInInfo({ ...signInInfo, pw: e })}
                visibilityToggle
                placeholder="请输入密码"
              />
            </FormItem>
            <FormItem wrapperCol={{}}>
              <Button type="primary">登录</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane key="2" title="注册">
          <Form className="sign-tabs-form" autoComplete="off">
            <FormItem label="用户名">
              <Input
                value={signUpInfo.name}
                onChange={setName}
                placeholder="请输入用户名"
              />
            </FormItem>
            <FormItem label="密码">
              <Input.Password
                value={signUpInfo.pw}
                onChange={setPw}
                visibilityToggle
                placeholder="请输入密码"
              />
            </FormItem>
            <FormItem label="重复密码">
              <Input.Password
                value={signUpInfo.repeatPw}
                onChange={setRepeatPw}
                visibilityToggle
                placeholder="请再次输入密码"
              />
            </FormItem>
            <FormItem wrapperCol={{}}>
              <Button type="primary">注册</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

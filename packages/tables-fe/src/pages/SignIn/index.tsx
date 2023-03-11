import "./index.less";

import { FC } from "react";

import { Button, Form, Input, Tabs, Typography } from "@arco-design/web-react";

import { signIn } from "../../http/user/signIn";
import { signUp } from "../../http/user/signUp";
import { useSignInInfo } from "./hooks/useSignInInfo";
import { useSignUpInfo } from "./hooks/useSignUpInfo";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

export const SignIn: FC = () => {
  const { setSignInInfo, signInInfo } = useSignInInfo();
  const { errorMsg, setName, setPw, setRepeatPw, signUpInfo } = useSignUpInfo();

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
            <FormItem className="sign-tabs-form-button" wrapperCol={{}}>
              <Button onClick={() => signIn(signInInfo)} type="primary">
                登录
              </Button>
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
                status={errorMsg.name ? "error" : undefined}
              />
              {!!errorMsg.name && (
                <Typography.Text type="error">{errorMsg.name}</Typography.Text>
              )}
            </FormItem>
            <FormItem label="密码">
              <Input.Password
                value={signUpInfo.pw}
                onChange={setPw}
                visibilityToggle
                placeholder="请输入密码"
                status={errorMsg.pw ? "error" : undefined}
              />
              {!!errorMsg.pw && (
                <Typography.Text type="error">{errorMsg.pw}</Typography.Text>
              )}
            </FormItem>
            <FormItem label="重复密码">
              <Input.Password
                value={signUpInfo.repeatPw}
                onChange={setRepeatPw}
                visibilityToggle
                placeholder="请再次输入密码"
                status={errorMsg.repeatPw ? "error" : undefined}
              />
              {!!errorMsg.repeatPw && (
                <Typography.Text type="error">
                  {errorMsg.repeatPw}
                </Typography.Text>
              )}
            </FormItem>
            <FormItem className="sign-tabs-form-button" wrapperCol={{}}>
              <Button
                type="primary"
                onClick={() => signUp(signUpInfo, errorMsg)}
              >
                注册
              </Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

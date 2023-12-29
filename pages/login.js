import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import userPool from '../aws/cognitoConfig';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { ThemeProvider } from 'styled-components'
import theme from '../styles/theme'

const PageContainer = styled.div`
  background-color: ${props => props.theme.element.app.backgroundColor};
  color: ${props => props.theme.element.app.color};
  color: #fff;
  height: 100vh;
  padding: 16px;
`;

const StyledForm = styled(Form)`
  max-width: 300px;
  margin: auto;
`;

const FormButton = styled(Button)`
  width: 100%;
`;

const Message = styled.p`
  color: ${({ theme, success }) => success ? theme.color.primary : 'red'};
  text-align: center;
`;

const ResetPasswordLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 10px;
`;

const Login = () => {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const onFinish = (values) => {
    const { username, password } = values;
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: () => {
        // Handle successful authentication here
        setIsSuccess(true);
        setMessage('Login successful!');
        router.push('/main'); // Redirect to homepage or dashboard
      },
      onFailure: (err) => {
        setIsSuccess(false);
        setMessage(err.message || JSON.stringify(err));
      },
    });
  };

  const handleSignupClick = () => {
    router.push('/signup'); // Redirect to the login page
  };

  const handleResetPassword = () => {
    // Redirect to the reset password page or open a modal
    router.push('/reset-password');
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <StyledForm
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <FormButton type="primary" htmlType="submit">
              Login
            </FormButton>

            <p>Don't have an account?</p>

            <FormButton type="secondary" onClick={handleSignupClick}>
              Sign Up
            </FormButton>
          </Form.Item>
          {message && <Message success={isSuccess}>{message}</Message>}
        </StyledForm>
        <ResetPasswordLink onClick={handleResetPassword}>
          Reset password
        </ResetPasswordLink>
      </PageContainer>
    </ThemeProvider>
  );
};

export default Login;

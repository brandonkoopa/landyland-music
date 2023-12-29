import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import styled, { ThemeProvider } from 'styled-components';
import { useRouter } from 'next/router';
import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../aws/cognitoConfig';
import theme from '../styles/theme';

const PageContainer = styled.div`
  background-color: ${props => props.theme.element.app.backgroundColor};
  color: ${props => props.theme.element.app.color};
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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const onFinishSignUp = (values) => {
    const { username, password, email } = values;
    setUsername(username); // Store username for confirmation
    setEmail(email); // Store email for resend option if needed

    userPool.signUp(username, password, [{ Name: 'email', Value: email }], null, (err, result) => {
      if (err) {
        setMessage(err.message || JSON.stringify(err));
        setIsSuccess(false);
        return;
      }
      setIsConfirming(true);
      setMessage('Check your email for a verification code and enter it here.');
    });
  };

  const handleLoginClick = () => {
    router.push('/login'); // Redirect to the login page
  };

  const onFinishVerification = () => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        setMessage(err.message || JSON.stringify(err));
        setIsSuccess(false);
        return;
      }
      setIsSuccess(true);
      setMessage('Email verified successfully. Redirecting to main...');
      router.push('/main');
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        {!isConfirming ? (
        <StyledForm
          name="signup"
          onFinish={onFinishSignUp}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <FormButton type="primary" htmlType="submit">
              Sign Up
            </FormButton>

            <p>Alright have an account?</p>

            <FormButton type="secondary" onClick={handleLoginClick}>
              Login
            </FormButton>
          </Form.Item>
          
          {message && <Message success={isSuccess}>{message}</Message>}

        </StyledForm>
        ) : (
          <StyledForm
            name="verify"
            onFinish={onFinishVerification}
          >
            <Form.Item
              name="verificationCode"
              rules={[{ required: true, message: 'Please input the verification code!' }]}
            >
              <Input
                placeholder="Verification Code"
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <FormButton type="primary" htmlType="submit">
                Verify Email
              </FormButton>
            </Form.Item>
            {message && <Message success={isSuccess}>{message}</Message>}
          </StyledForm>
        )}
      </PageContainer>
    </ThemeProvider>
  );
};

export default SignUp;

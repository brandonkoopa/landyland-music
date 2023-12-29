import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import styled, { ThemeProvider } from 'styled-components';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/router';
import userPool from '../aws/cognitoConfig';
import theme from '../styles/theme';

const PageContainer = styled.div`
  background-color: ${props => props.theme.element.tab.backgroundColor};
  color: ${props => props.theme.element.tab.color};
  height: 100vh;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledForm = styled(Form)`
  max-width: 300px;
  margin: auto;
`;

const FormButton = styled(Button)`
  width: 100%;
`;

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState(1); // 1: Email submission, 2: Code and new password, 3: Success
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleEmailSubmit = async () => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
        setStage(2); // Move to next stage
        setMessage('A verification code has been sent to your email.');
      },
      onFailure: err => {
        setMessage(err.message || 'Failed to send verification code.');
      },
    });
  };

  const handlePasswordReset = async () => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        setMessage('Password reset successful. You can now log in with your new password.');
        setStage(3); // Set to success stage
      },
      onFailure: err => {
        setMessage(err.message || 'Failed to reset password.');
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>

        {stage === 1 && (
          <StyledForm onFinish={handleEmailSubmit}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <FormButton type="primary" htmlType="submit">
              Submit
            </FormButton>
          </Form.Item>
          {message && <p>{message}</p>}
          </StyledForm>
        )}

        {stage === 2 && (
          <StyledForm onFinish={handlePasswordReset}>
          <Form.Item
            name="verificationCode"
            rules={[{ required: true, message: 'Please input the verification code!' }]}
          >
            <Input
              placeholder="Verification Code"
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: 'Please input your new password!' }]}
          >
            <Input.Password
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <FormButton type="primary" htmlType="submit">
              Reset Password
            </FormButton>
          </Form.Item>
          {message && <p>{message}</p>}
        </StyledForm>
        )}

        {stage === 3 && (
          <div>
            <p>{message}</p>
            <Button type="primary" onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        )}
      </PageContainer>
    </ThemeProvider>
  );
};

export default ResetPassword;
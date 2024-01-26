import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import styled, { ThemeProvider } from 'styled-components';
import { useRouter } from 'next/router';
import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../aws/cognitoConfig';
import theme from '../styles/theme';
// import Skyline from './components/art/Skyline';

const PageContainer = styled.div`
  background: ${props => props.theme.element.app.backgroundColor};
  color: ${props => props.theme.element.app.color};
  height: 100vh;
  padding: 16px;
`;

const Skyline = styled.div`
  background-image: url(/skyline.png);
  width: 100%;
  height: 200px;
  position: fixed;
  bottom: -58px;
  background-size: 125%;
  background-repeat: no-repeat;
  right: 0;
  left: 0;
`

const Title = styled.h2`
  text-align: center;
`

const Paragraph = styled.p`
  text-align: center;
`

const StyledForm = styled(Form)`
  color: ${props => props.theme.element.app.color};
  max-width: 300px;
  margin: 32px auto 0;

  .ant-form-item {
    color: ${props => props.theme.element.app.color};
  }
`;

const LoginContainer = styled.div`
  color: ${props => props.theme.element.app.color};
  margin-top: 32px;
`

const FormButton = styled(Button)`
  width: 100%;
`;

const LinkButton = styled(Button)`
  span {
    color: ${props => props.theme.color.primary};
  }
`;

const Message = styled.p`
  color: ${({ theme, success }) => success ? theme.color.primary : 'red'};
  text-align: center;
`;

// const StyledSkyline = styled(Skyline)`
//   position: fixed;
//   bottom: 50px;
//   left: 100px;
//   scale: 2;
// `

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
        <Skyline width="32" height="32" />
        <Title>Register</Title>
        <Paragraph>So we can save your creations online, first create your username & password.</Paragraph>
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
              Register
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
        <LoginContainer>
          <p>Have account?</p>

          <LinkButton type="secondary" onClick={handleLoginClick}>
            Login
          </LinkButton>
        </LoginContainer>

      </PageContainer>
    </ThemeProvider>
  );
};

export default SignUp;

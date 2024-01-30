import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components'
import theme from '../styles/theme'
// import Main from './main'
// import SignUp from './signup'

const Index = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Assuming `user` determines if someone is logged in or not.
    // If `user` is null or undefined, redirect to the SignUp page.
    // const user = null; // Replace this with your actual logic to determine if a user is logged in.
    
    if (user === null) {
      // ToDo: add logic to decide if you should go to signup/login or if you should go to main, and/or if you should load cnotent
      // router.push('/signup');
    }
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      {/* {user == null ? <SignUp /> : <Main />} */}
    </ThemeProvider>
  );
}

export default Index;

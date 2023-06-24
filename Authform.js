import React, { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from './AuthContext';
import './Authform.css';


const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current?.value;

    setIsLoading(true);
    setError(null);

    if (!isLogin && enteredPassword !== enteredConfirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDx0SVoBQfPlrxT68IwmNR3OKKdQdp-1Yw';
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDx0SVoBQfPlrxT68IwmNR3OKKdQdp-1Yw';
    }

    // Make the API request
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Authentication failed.');
        }
      })
      .then((data) => {
        const expirationTime = new Date().getTime() + parseInt(data.expiresIn) * 1000;
        authCtx.login(data.idToken, expirationTime);
        navigate('/Dashboard'); // Redirect to the dashboard or any desired page
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="container">
      <div className="box">
        <h1 className="heading">{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="label" htmlFor="email">Email</label>
            <input
              className="input"
              type="email"
              id="email"
              required
              ref={emailInputRef}
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input
              className="input"
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label className="label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="input"
                type="password"
                id="confirmPassword"
                required
                ref={confirmPasswordInputRef}
              />
            </div>
          )}
          {error && <p className="error">{error}</p>}
          <div className="button">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <button>{isLogin ? 'Login' : 'Create Account'}</button>
            )}
          </div>
        </form>
        <div className="toggle">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <Link to="/signup" onClick={switchAuthModeHandler}>
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Have an account?{' '}
              <Link to="/login" onClick={switchAuthModeHandler}>
                Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

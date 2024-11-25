import { useEffect, useState } from 'react';
import logo from '../../assets/images/logoO.png';
import { useUserAuth } from '../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {user, signIn} = useUserAuth();
  const navigate = useNavigate();

  if(user) {
    return <Navigate to='/' />;
  }

  
  const handleLogIn = async(e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate('/');
    } catch(err) {
      setError(err.message);
    }
  }

  return (
    <section className="logIn h-screen flex flex-col justify-center items-center ">
      <div className="md:w-1/3 max-w-sm">
        <img
          src={logo}
          alt="SSIJ logo"
        />
      </div>
      <div className="md:w-1/3 max-w-sm flex flex-col justify-center items-center">
        <input
          className="outline-none shadow-md text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="outline-none shadow-md text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
            <input className="mr-1" type="checkbox" />
            <span>Remember Me</span>
          </label>
          <a
            className=" text-orange-500 hover:underline hover:underline-offset-4"
            href="#"
          >
            Forgot Password?
          </a>
        </div> */}
        {error && <p className="text-red-500">{error}</p>}
        <div className="text-center md:text-left">
          <button
            className="mt-4 shadow-md px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
            onClick={handleLogIn}
          >
            Login
          </button>
        </div>
        {/* <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don&apos;t have an account?{" "}
          <a
            className="text-red-600 hover:underline hover:underline-offset-4"
            href="#"
          >
            Register
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Login;
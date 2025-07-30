import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

function LoginForm() {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await login(formData);
            if (success) {
                console.log("Success logging in!");
                navigate('/home');
            } else {
                console.log("Login failed.")
            }
        } catch (error) {
            console.log(error);
        };
    };


  return (
    <div className="px-16 py-6 bg-gray-100 md:col-span-2 min-h-screen flex flex-col">
      <div className="flex justify-center sm:justify-center md:justify-end">
        <Link
          to={"/login"}
          className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-primary ml-2 btn border md:border-2 hover:bg-gray-400 hover:text-white"
        >
          Sign up
        </Link>
      </div>
      <main className="flex flex-col items-center justify-center flex-1">
        <h5 className="text-2xl font-semibold mb-6  border-b-2">Prijava</h5>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="username"
              >
                Username
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                placeholder="example123"
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="password"
              >
                Lozinka
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                placeholder="******************"
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <label className="md:w-2/3 block text-gray-500 font-bold">
              <span className="text-sm hover:border-b-2 hover:border-gray-400">
                <Link to={"/signup"}>Nemaš registrovan profil?</Link>
              </span>
            </label>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default LoginForm;

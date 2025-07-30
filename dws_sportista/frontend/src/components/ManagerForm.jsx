import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

function ManagerForm() {
  const { isLoggedIn, logout, userData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    user_id: userData.id,
    request_date: '',
    reason: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (submissionStatus === 'success') {
      const timer = setTimeout(() => {
        navigate('/home');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userPayload = {
      ...formData,
      request_date: new Date().toISOString()
    };

    try {
      const response = await fetch("http://localhost:8000/users/manager-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userPayload)
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error(error);
      setSubmissionStatus('error');
    }
  };

  return (
    <div className="px-16 py-6 bg-gray-100 md:col-span-2 min-h-screen flex flex-col">
      <div className="flex justify-center sm:justify-center md:justify-end">
        {isLoggedIn ? (
          <button
            className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white"
            onClick={logout}
          >
            Sign out
          </button>
        ) : (
          <>
            <Link
              to={"/login"}
              className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white"
            >
              Login
            </Link>
            <Link
              to={"/signup"}
              className="text-primary ml-2 btn border md:border-2 hover:bg-gray-400 hover:text-white"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      <main className="flex flex-col items-center justify-center flex-1">
        <h5 className="text-2xl font-semibold mb-8 mt-4 border-b-2">
          Postani dio menadžer ekipe!
        </h5>
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          {/* Other form fields */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="reason"
              >
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Enter your reason here..."
              ></textarea>
            </div>
          </div>
          <div className="md:flex md:items-center mt-3">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        {submissionStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
            Successfully submitted manager application! Redirecting to home...
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
            Failed to submit manager application. Please try again.
          </div>
        )}
      </main>
    </div>
  );
}

export default ManagerForm;

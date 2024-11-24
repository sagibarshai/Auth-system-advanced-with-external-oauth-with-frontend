import { useEffect, useState } from "react";

const SigninPage = () => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState<{ message: string }[] | null>(null);

  const redirectToGoogle = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const userData = params.get("user");
    const errorData = params.get("errors");

    if (errorData) {
      // Decode and parse the error message
      const parsedErrors = JSON.parse(decodeURIComponent(errorData));
      setErrors(parsedErrors);
    } else if (userData) {
      // Decode and parse user data
      const parsedUser = JSON.parse(decodeURIComponent(userData));
      setUser(parsedUser);
    } else {
      redirectToGoogle();
    }
  }, []);

  return (
    <div>
      {errors ? (
        <div>
          <h2>Authentication Failed</h2>
          <ul>
            {errors.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      ) : user ? (
        <h1>Welcome!</h1>
      ) : null}
    </div>
  );
};

export default SigninPage;

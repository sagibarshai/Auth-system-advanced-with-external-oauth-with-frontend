import axios from "axios";
import { useEffect, useState } from "react";

const SignupPage = () => {
  const [user, setUser] = useState(null);
  const makeRequest = async () => {
    try {
      const user = await axios.post("http://localhost:4000/api/auth/signup", {
        email: "sagibarshai1@gmail.com",
        password: "helloWorld12!",
      });
      setUser(user.data);
      console.log("user ", user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    makeRequest();
  }, []);

  return <h1>{JSON.stringify(user) || "Hello signup"}</h1>;
};

export default SignupPage;

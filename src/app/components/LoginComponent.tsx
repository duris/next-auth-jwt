"use client";
import { useSession, signIn, signOut } from "next-auth/react";
const jwt = require("jsonwebtoken");

function LoginComponent() {
  const { data: session, status } = useSession();

  if (!session || !session.user) {
    if (status == "loading") {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <p>You are not signed in</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          className=" p-2 bg-yellow-50 text-black rounded-lg mx-2 hover:bg-yellow-100"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }
}

export default LoginComponent;

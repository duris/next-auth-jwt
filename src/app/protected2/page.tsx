import { Session, User, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BeakerIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import React from "react";
import LoginComponent from "../components/LoginComponent";
import authOptions from "../lib/auth";

const Protected = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = session.user as User;

  console.log(user);

  return (
    <div className="flex flex-col w-full max-w-2xl">
      <div>
        <LoginComponent />
      </div>
      <div className="flex items-center">
        <h1 className=" text-4xl m-10">Protected Page 2</h1>
        <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
      </div>
      <div className="flex flex-col p-2 bg-black rounded-lg m-2">
        <div>name: {user.username}</div>
        <div>email: {user.email}</div>
        <div>subdomain: {user.subdomain}</div>
        <div>tenantId: {user.tenantId}</div>
      </div>
    </div>
  );
};

export default Protected;

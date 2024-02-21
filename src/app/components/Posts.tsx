import React from "react";
import { getSession } from "../lib/auth";
export const Posts = async () => {
  const session = await getSession();

  const token = session?.user?.accessToken;

  const getPosts = async () => {
    try {
      const res = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return error;
    }
  };
  const posts = (await getPosts()) as any;

  return <div>{posts ? JSON.stringify(posts) : ""}</div>;
};

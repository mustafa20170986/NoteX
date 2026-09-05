"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SyncUser() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    async function syncUser() {
      if (
        !isLoaded ||
        !isSignedIn ||
        !user ||
        !user.primaryEmailAddress?.emailAddress
      )
        return;
      try {
        const token = await getToken();
        if (!token) return;
        const response = await fetch("http://localhost:2017/user/createuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: user?.id,
            name: user?.fullName || "AnonyMouseuser",
            email: user?.primaryEmailAddress?.emailAddress,
            
          }),
        });
        const res = await response.json();
        console.log(token);
        //if notsignedin not token is loaded and if there is no user just return
        if (!isSignedIn || !isLoaded || !user) return;

        if (!token) return;
      } catch (error) {
        console.log(error);
      }
    }
    syncUser();
  }, [getToken, isLoaded, isSignedIn, user]);
  return {
    isSignedIn,
    isLoaded,
    token: getToken,
    username: user,
  };
}

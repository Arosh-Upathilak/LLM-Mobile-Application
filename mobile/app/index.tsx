import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Redirect } from "expo-router";

export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const subscription = async () => {
      const token = await SecureStore.getItem("accessToken");
      setLoggedInUser(token ? true : false);
      setLoading(false);
    };
    subscription();
  }, []);


  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Redirect href={!loggedInUser ? "/(routes)/onboarding" : "/(tabs)"} />
      )}
    </>
  );
}

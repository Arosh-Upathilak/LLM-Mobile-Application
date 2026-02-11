import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Redirect } from "expo-router";

export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState<boolean | null>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const subscription = async () => {
      const token = await SecureStore.getItem("accessToken");
      setLoggedInUser(token ? true : false);
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

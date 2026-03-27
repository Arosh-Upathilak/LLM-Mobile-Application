import { View, Text, Pressable, Image, Platform } from "react-native";
import React, { useEffect } from "react";
import { BlurView } from "expo-blur";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import JWT from "expo-jwt";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const AuthModal = ({
  setModalVisible,
}: {
  setModalVisible: (modal: boolean) => void;
}) => {
  const configureGoogleSignIn = () => {
    if (Platform.OS === "ios") {
      GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_IOS_GOOGLE_API_KEY,
      });
    } else {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_API_KEY,
      });
    }
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // github auth start
  const githubAuthEndpoints = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
  };
  // eslint-disable-next-line
  const [request, response] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET!,
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "llms",
      }),
    },
    githubAuthEndpoints,
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      fetchAccessToken(code);
    }
    // eslint-disable-next-line
  }, []);

  /*const handleGithubLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      request?.url!,
      makeRedirectUri({
        scheme: "becodemy",
      }),
    );

    if (result.type === "success" && result.url) {
      const urlParams = new URLSearchParams(result.url.split("?")[1]);
      const code: any = urlParams.get("code");
      fetchAccessToken(code);
    }
  };*/

  const fetchAccessToken = async (code: string) => {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}&code=${code}`,
      },
    );
    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;
    if (access_token) {
      fetchUserInfo(access_token);
    } else {
      // eslint-disable-next-line
      console.error("Error fetching access token:", tokenData);
    }
  };

  const fetchUserInfo = async (token: string) => {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userResponse.json();
    await authHandler({
      name: userData.name!,
      email: userData.email!,
      avatar: userData.avatar_url!,
    });
  };

  //

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      await authHandler({
        name: userInfo.data?.user.name ?? "",
        email: userInfo.data?.user.email ?? "",
        avatar: userInfo.data?.user.photo ?? "",
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const authHandler = async ({ name, email, avatar }: AuthHandlerProps) => {
    const user = {
      name,
      email,
      avatar,
    };
    const token = JWT.encode(
      { ...user },
      process.env.EXPO_PUBLIC_JWT_SECRET_KEY as string,
    );
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER_URL}/user/login`,
      {
        signToken: token,
      },
    );
    await SecureStore.setItemAsync("accessToken", res.data.accessToken);
    await SecureStore.setItemAsync("name", name);
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("avatar", avatar);
    setModalVisible(false);
    router.push("/(tabs)");
  };

  return (
    <BlurView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Pressable
        style={{
          width: windowWidth(420),
          height: windowHeight(250),
          marginHorizontal: windowWidth(50),
          backgroundColor: "#fff",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={(e) => e.stopPropagation()}
      >
        <Text
          style={{
            fontSize: fontSizes.FONT35,
            fontFamily: "Poppins_700Bold",
          }}
        >
          Join to becodemy
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT17,
            paddingTop: windowHeight(5),
            fontFamily: "Poppins_300Light",
          }}
        >
          It&apos;s easier than your imagination!
        </Text>
        <View
          style={{
            paddingVertical: windowHeight(10),
            flexDirection: "row",
            gap: windowWidth(20),
          }}
        >
          <Pressable onPress={googleSignIn}>
            <Image
              source={require("@/assets/images/onboarding/google.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/images/onboarding/github.png")}
              style={{
                width: windowWidth(40),
                height: windowHeight(40),
                resizeMode: "contain",
              }}
            />
          </Pressable>
          {Platform.OS === "ios" && (
            <Pressable>
              <Image
                source={require("@/assets/images/onboarding/apple.png")}
                style={{
                  width: windowWidth(40),
                  height: windowHeight(40),
                  resizeMode: "contain",
                }}
              />
            </Pressable>
          )}
        </View>
      </Pressable>
    </BlurView>
  );
};

export default AuthModal;

import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import useUser, { setAuthorizationHeader } from "@/hook/fetch/useUser";
import { useTheme } from "@/context/theme.context";
import {
  fontSizes,
  IsAndroid,
  IsIPAD,
  SCREEN_WIDTH,
  windowHeight,
  windowWidth,
} from "@/themes/app.constant";
import { scale, verticalScale } from "react-native-size-matters";
import axios from "axios";
import ReviewCard from "@/components/cards/review.card";
import { BlurView } from "expo-blur";
import CourseDetailsLoader from "@/utils/course-details-skelton";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CourseDetailsTabs from "@/components/course/course.details.tabs";
import CourseLesson from "@/components/course/course.lesson";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { Spacer } from "@/utils/skelton";

export default function CourseDetailsScreen() {
  const params: any = useGlobalSearchParams();
  const [purchaseLoader, setPurchaseLoader] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const [activeButton, setActiveButton] = useState("About");
  const { user, loader: userLoader } = useUser();
  const { theme } = useTheme();
  const prerequisites: BenefitsType[] | any = JSON.parse(params?.prerequisites);
  const benefits: BenefitsType[] | any = JSON.parse(params?.benefits);
  const courseContent: CourseDataType[] | any = JSON.parse(
    params?.courseContent,
  );

  const courseData: any = params;

  if (userLoader) return <CourseDetailsLoader />;

  const isPurchased = user?.orders?.find(
    (i: any) => i.courseId === courseData.id,
  );

  const reviewsFetchingHandler = async () => {
    setActiveButton("Reviews");
    await axios
      .get(`http://10.159.165.105:5000/api/course/get-reviews/${params.id}`)
      .then((res) => {
        setReviews(res.data.reviewsData);
        setLoader(false);
      });
  };

  const handlePurchase = async () => {
    setPurchaseLoader(true);
  };
  const handleCourseAccess = () => {};

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.dark ? "#131313" : "#fff" }}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ padding: windowWidth(15) }}>
          <Image
            source={{
              uri:
                courseData.slug ===
                "multi-vendor-mern-stack-e-commerce-project-with-all-functionalities-absolutely-for-beginners"
                  ? "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574266/TMECA_yddc73.png"
                  : courseData.slug ===
                      "build-your-mobile-app-development-career-with-react-native"
                    ? "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1731448241/thumbnail_jwi5xo.png"
                    : "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1711468889/courses/spe7bcczfpjmtsdjzm6x.png",
            }}
            resizeMode="contain"
            style={{
              width: IsAndroid ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 25,
              height: IsAndroid
                ? (SCREEN_WIDTH - 28) * 0.5625
                : (SCREEN_WIDTH - 40) * 0.5625,
              alignSelf: "center",
              borderRadius: windowWidth(10),
            }}
          />
          <Text
            style={{
              fontSize: fontSizes.FONT22,
              fontFamily: "Poppins_600SemiBold",
              paddingTop: verticalScale(10),
              color: theme.dark ? "#fff" : "#3E3B54",
              lineHeight: windowHeight(20),
            }}
          >
            {courseData.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizes.FONT22,
                  fontFamily: "Poppins_400Regular",
                  paddingTop: windowHeight(8),
                  color: theme.dark ? "#fff" : "#000",
                  lineHeight: windowHeight(20),
                }}
              >
                ${courseData?.price}
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.FONT22,
                  fontFamily: "Poppins_400Regular",
                  color: theme.dark ? "#fff" : "#3E3B54",
                  lineHeight: IsIPAD ? windowHeight(0) : windowHeight(20),
                  paddingLeft: windowWidth(5),
                  textDecorationLine: "line-through",
                }}
              >
                ${courseData?.estimatedPrice}
              </Text>
            </View>
            <Text
              style={{
                fontSize: fontSizes.FONT18,
                fontFamily: "Poppins_400Regular",
                color: theme.dark ? "#fff" : "#000",
              }}
            >
              {courseData?.purchased} Students
            </Text>
          </View>

          {/* Course prerequisites */}
          <View style={{ paddingTop: windowHeight(12) }}>
            <Text
              style={{
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
                paddingTop: windowHeight(8),
                color: theme.dark ? "#fff" : "#3E3B54",
                lineHeight: windowHeight(20),
              }}
            >
              Course Prerequisites
            </Text>
            {prerequisites?.map((i: BenefitsType, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  paddingVertical: windowHeight(5),
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={scale(17)}
                  color={theme.dark ? "#fff" : "#000"}
                />
                <Text
                  style={{
                    marginLeft: windowWidth(5),
                    fontSize: fontSizes.FONT18,
                    color: theme.dark ? "#fff" : "#000",
                  }}
                >
                  {i?.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Course Benefits */}
          <View style={{ paddingTop: windowHeight(12) }}>
            <Text
              style={{
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
                paddingTop: windowHeight(8),
                color: theme.dark ? "#fff" : "#3E3B54",
                lineHeight: windowHeight(20),
              }}
            >
              Course Benefits
            </Text>
            {benefits?.map((i: BenefitsType, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  paddingVertical: windowHeight(5),
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={scale(17)}
                  color={theme.dark ? "#fff" : "#000"}
                />
                <Text
                  style={{
                    marginLeft: windowWidth(5),
                    fontSize: fontSizes.FONT18,
                    color: theme.dark ? "#fff" : "#000",
                  }}
                >
                  {i?.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Course Tabs */}
          <CourseDetailsTabs
            activeButton={activeButton}
            reviewsFetchingHandler={reviewsFetchingHandler}
            setActiveButton={setActiveButton}
          />

          {activeButton === "About" && (
            <View
              style={{
                marginHorizontal: scale(12),
                marginVertical: verticalScale(10),
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.FONT25,
                  fontFamily: "Poppins_500Medium",
                  color: theme.dark ? "#fff" : "#000",
                }}
              >
                About course
              </Text>
              <Text
                style={{
                  color: !theme.dark ? "#525258" : "#fff",
                  fontSize: fontSizes.FONT20,
                  marginTop: 10,
                  textAlign: "justify",
                }}
              >
                {isExpanded
                  ? courseData?.description
                  : courseData?.description.slice(0, 302)}
              </Text>
              {courseData?.description.length > 302 && (
                <TouchableOpacity
                  style={{ marginTop: verticalScale(2) }}
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  <Text
                    style={{
                      color: "#2467EC",
                      fontSize: fontSizes.FONT16,
                    }}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                    {isExpanded ? "-" : "+"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {activeButton === "Lessons" && (
            <View
              style={{
                marginHorizontal: verticalScale(16),
                marginVertical: scale(15),
              }}
            >
              <CourseLesson courseDetails={courseContent} />
            </View>
          )}

          {activeButton === "Reviews" && (
            <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
              <View style={{ rowGap: 25 }}>
                {loader && (
                  <>
                    {[0, 1, 2, 3, 4, 5].map((i: any) => (
                      <MotiView
                        key={i}
                        transition={{
                          type: "timing",
                        }}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          gap: scale(10),
                          marginVertical: verticalScale(10),
                        }}
                        animate={{
                          backgroundColor: theme.dark ? "#131313" : "#fff",
                        }}
                      >
                        <Skeleton
                          colorMode={theme.dark ? "dark" : "light"}
                          radius="round"
                          height={verticalScale(55)}
                          width={verticalScale(55)}
                        />
                        <View>
                          <Skeleton
                            colorMode={theme.dark ? "dark" : "light"}
                            width={scale(240)}
                            height={verticalScale(22)}
                          />
                          <Spacer height={verticalScale(15)} />
                          <Skeleton
                            colorMode={theme.dark ? "dark" : "light"}
                            width={scale(240)}
                            height={verticalScale(22)}
                          />
                        </View>
                      </MotiView>
                    ))}
                  </>
                )}
              </View>
              {reviews?.map((item: ReviewsType, index: number) => (
                <ReviewCard item={item} key={index} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BlurView
        intensity={theme.dark ? 30 : 2}
        style={{
          backgroundColor: !theme.dark ? "#eaf3fb85" : "#000",
          paddingHorizontal: windowHeight(12),
          paddingVertical: windowHeight(8),
          paddingBottom: IsAndroid
            ? verticalScale(5) + insets.bottom
            : windowHeight(20),
        }}
      >
        {isPurchased ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#2467EC",
              paddingVertical: windowHeight(10),
              borderRadius: windowWidth(8),
            }}
            onPress={() => handleCourseAccess()}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#FFFF",
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Enter to course
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#2467EC",
              paddingVertical: windowHeight(10),
              borderRadius: windowWidth(8),
              opacity: purchaseLoader ? 0.6 : 1,
            }}
            //disabled={purchaseLoader}
            onPress={() =>
              router.push({
                pathname: "/(routes)/course-access",
                params: {
                  ...courseData,
                },
              })
            }
          >
            <Text
              style={{
                textAlign: "center",
                color: "#FFFF",
                fontSize: fontSizes.FONT24,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Enter the course{" "}
              {courseData?.price === "0" ? "(free)" : `$${courseData?.price}`}
            </Text>
          </TouchableOpacity>
        )}
      </BlurView>
    </SafeAreaView>
  );
}

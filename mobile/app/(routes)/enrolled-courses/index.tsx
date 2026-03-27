import { FlatList,  Text, View } from "react-native";
import React from "react";
import { useTheme } from "@/context/theme.context";
import useGetCourses from "@/hook/fetch/useGetCourses";
import { SafeAreaView } from "react-native-safe-area-context";
import SkeltonLoader from "@/utils/skelton";
import { scale, verticalScale } from "react-native-size-matters";
import CourseCard from "@/components/cards/course.card";


export default function EnrolledCourses() {
  const { theme } = useTheme();
  const { courses, loading } = useGetCourses();
  

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.dark ? "#131313" : "#fff",
      }}
    >

        <View style={{ flex: 1 }}>
          {loading ? (
            <>
              <SkeltonLoader />
              <SkeltonLoader />
            </>
          ) : (
            <View
              style={{
                paddingHorizontal: scale(8),
              }}
            >
              <FlatList
                data={courses}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CourseCard item={item} />}
                ListEmptyComponent={<Text>No courses Available yet!</Text>}
                ListFooterComponent={() => (
                  <View
                    style={{
                      height: theme.dark
                        ? verticalScale(60)
                        : verticalScale(10),
                    }}
                  ></View>
                )}
              />
            </View>
          )}
        </View>
     
    </SafeAreaView>
  );
}
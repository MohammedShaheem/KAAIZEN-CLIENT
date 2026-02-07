import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDailySummary,getMealEntries } from "@/services/client/meals";
import { useSelector } from "react-redux";
import { Spinner } from "@/components/common/Spinner";
import SubmitButton from "@/components/ui/SubmitButton";
import TrackersComponent from "@/components/client/dashboard/TrackersComponent";
import GoalsComponent from "@/components/client/dashboard/GoalComponent";
import LogsComponent from "@/components/client/dashboard/LogsComponent";
import ClientLayout from "@/components/client/layout/ClientLayout";
import { useClientProfile } from "@/hooks/client/profile/useClientProfile";
import { useDailySummary,useMealEntries } from "@/hooks/client/nutrition/useMeals";

const MealEntryPage = () => {
  const navigate = useNavigate();
  const {
      data: profile,
    } = useClientProfile();

  const currentDate = new Date().toISOString().split("T")[0];

  const {
    data: dailySummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useDailySummary(currentDate)

  const {
    data: mealEntries = [],
    isLoading: mealsLoading,
    error: mealsError,
  } = useMealEntries(currentDate)


  const handleAddMeal = () => {
    navigate("/meals/log");
  };

  const handleTrackMore = () => {
    console.log("Track more clicked");
  };

    if (summaryLoading || mealsLoading) {
    return <Spinner loading={true} />
  }

  if (summaryError || mealsError) {
    return (
      <div className="text-red-500">
        Error: {(summaryError || mealsError)?.message}
      </div>
    )
  }

  console.log("mealEntries",mealEntries)
  console.log("dailysummary",dailySummary)
  console.log("profile",profile)
  const targetCalories =  profile?.target_daily_calories|| 0;
  
  const userData = {
    name: profile?.full_name || "User",
  }; 

  return (
    <ClientLayout
      theme="orange"
      headerProps={{
        userName: userData?.name || "Client",
        location: "Meal Tracking",
        // userImage: user?.profile_image,
      }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Meal Tracking</h2>

        {/* <FoodTrackingCard
          dailySummary={dailySummary}
          targetCalories={targetCalories}
        /> */}

        <TrackersComponent onTrackMore={handleTrackMore} />

        <GoalsComponent
          dailySummary={dailySummary}
          targetCalories={targetCalories}
        />

        <LogsComponent mealEntries={mealEntries} />

        <SubmitButton onClick={handleAddMeal} type="button">
          Add Meal
        </SubmitButton>
      </div>
    </ClientLayout>
  );
};

export default MealEntryPage;

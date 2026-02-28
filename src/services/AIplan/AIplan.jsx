import api from "@/api/axios"


export const getAIPlan = async () => {
  try {
    const response = await api.get("/api/ai/generate-ai-plan/")
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch AI plan"
    )
  }
}

export const generateAIPlan = async () => {
  try {
    const response = await api.post("/api/ai/generate-ai-plan/")
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to generate AI plan"
    )
  }
}

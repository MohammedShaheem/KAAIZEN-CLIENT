import { motion } from "framer-motion"
import { Dumbbell } from "lucide-react"

export const Spinner = ({ loading = true }) => {
  if (!loading) return null

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="flex justify-center items-center"
      >
        <Dumbbell className="text-purple-600" size={56} />
      </motion.div>
    </div>
  )
}

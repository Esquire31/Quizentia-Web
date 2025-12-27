import { motion } from "framer-motion"
import logo from "../../assets/logo.png"

interface QuizHeaderProps {
  title: string
}

export function QuizHeader({ title }: QuizHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pt-8 pb-12 text-center"
    >
      <img src={logo} alt="Quizentia Logo" className="mx-auto" />  
      <p className="text-gray-700 text-lg">{title}</p>
    </motion.header>
  )
}
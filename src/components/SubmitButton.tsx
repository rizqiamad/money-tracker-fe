import { motion } from 'framer-motion'

interface IProps {
  isPending: boolean
  text: string
  textLoading: string
}

export default function SubmitButton({ isPending, text, textLoading }: IProps) {
  return (
    <motion.button
      whileHover={{ scale: isPending ? 1 : 1.01 }}
      whileTap={{ scale: isPending ? 1 : 0.99 }}
      disabled={isPending}
      className="cursor-pointer disabled:cursor-not-allowed w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600 disabled:opacity-70 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all mt-4 flex items-center justify-center gap-2"
    >
      {isPending ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {textLoading}
        </>
      ) : (
        `${text}`
      )}
    </motion.button>
  )
}
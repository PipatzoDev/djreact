"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const cardsData = [
  {
    id: 1,
    title: "Proyecto Fénix",
    date: "2025-02-07",
    creator: "Ana García",
    imageUrl: "/placeholder.svg?height=300&width=400",
    hasFile: true,
    size: "large",
  },
  {
    id: 2,
    title: "Sombra Escarlata",
    date: "2025-02-06",
    creator: "Carlos López",
    imageUrl: "/placeholder.svg?height=200&width=300",
    hasFile: false,
    size: "small",
  },
  {
    id: 3,
    title: "Código Carmesí",
    date: "2025-02-05",
    creator: "Elena Martínez",
    imageUrl: "/placeholder.svg?height=250&width=350",
    hasFile: true,
    size: "medium",
  },
  {
    id: 4,
    title: "Nexo Oscuro",
    date: "2025-02-04",
    creator: "David Wilson",
    imageUrl: "/placeholder.svg?height=200&width=300",
    hasFile: true,
    size: "small",
  },
  {
    id: 5,
    title: "Rubí Digital",
    date: "2025-02-03",
    creator: "Fiona Black",
    imageUrl: "/placeholder.svg?height=250&width=350",
    hasFile: false,
    size: "medium",
  },
]

const getRandomRedShade = () => {
  const shades = ["#ff0000", "#cc0000", "#990000", "#660000", "#330000"]
  return shades[Math.floor(Math.random() * shades.length)]
}

const NeonCard = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-2 lg:col-span-1",
    large: "col-span-1 md:col-span-2",
  }

  return (
    <motion.div
      className={`${sizeClasses[card.size]} relative group`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0.5 bg-red-900 rounded-2xl shadow-lg"></div>
      <div className="relative bg-black rounded-2xl p-6 h-full flex flex-col justify-between overflow-hidden group-hover:bg-gray-900 transition-colors duration-300">
        <div>
          <img
            src={card.imageUrl || "/placeholder.svg"}
            alt={card.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-red-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-red-800 transition-all duration-300">
            {card.title}
          </h2>
          <p className="text-red-300 mb-2">{card.date}</p>
          <p className="text-red-300">{card.creator}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          {card.hasFile ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-red-500"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-red-800"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}
          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver más
          </motion.button>
        </div>
      </div>
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-700 to-red-900 opacity-20 rounded-2xl filter blur-md"></div>
      )}
    </motion.div>
  )
}

const BlackRedNeonCards = () => {
  return (
    <div className="min-h-screen bg-black p-8 relative overflow-hidden">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: getRandomRedShade(),
              filter: "blur(100px)",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-6xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-700 to-red-900">
          Galería Carmesí
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardsData.map((card) => (
            <NeonCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlackRedNeonCards


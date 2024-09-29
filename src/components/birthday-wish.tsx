"use client";
import React, {useState, useEffect} from "react"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter  } from "./ui/card"
import {motion, AnimatePresence } from 'framer-motion'
import dynamic from "next/dynamic"
import {FaBirthdayCake, FaGift} from 'react-icons/fa'
import { GiBalloons } from "react-icons/gi"
type ConfettiProps={
    width: number
    height: number
}

const DynamicConfetti = dynamic(()=> import('react-confetti'), {ssr:false}) 
const candleColors = ['#BB8FCE', '#000000', '#A52A2A', '#0000FF', '#98D8C8', '#4ECDC4','#FFFF00' ]
const balloonColors = ['#7FFF00', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFFF00']
const confettiColors = ['#006400', '#2F4F4F', '#483D8B', '#FFA07A', '#BC8F8F', '#F7DC6F', '#BB8FCE']

export default function BirthdayWish() {
  const [candlesLit, setCandlesLit] = useState<number>(0) 
  const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0) 
  const [showConfetti, setShowConfetti] = useState<boolean>(false) 
  const [windowSize, setWindowSize] = useState<ConfettiProps>({ width: 0, height: 0 }) 
  const [celebrating, setCelebrating] = useState<boolean>(false) 

 
  const totalCandles: number = 7 
  const totalBalloons: number = 5 

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  
  // Effect to show confetti when all candles are lit and balloons are popped
  useEffect(() => {
    if (candlesLit === totalCandles && balloonsPoppedCount === totalBalloons) {
      setShowConfetti(true)
    }
  }, [candlesLit, balloonsPoppedCount])

  // Function to light a candle
  const lightCandle = (index: number) => {
    if (index === candlesLit) {
      setCandlesLit(prev => prev + 1)
    }
  }

 // Function to pop a balloon
 const popBalloon = (index: number) => {
    if (index === balloonsPoppedCount) {
      setBalloonsPoppedCount(prev => prev + 1)
    }
  }

  // Function to start celebration
  const celebrate = () => {
    setCelebrating(true)
    setShowConfetti(true)
    const interval = setInterval(() => {
      setCandlesLit(prev => {
        if (prev < totalCandles) return prev + 1
        clearInterval(interval)
        return prev
      })
    }, 300)
  }

  return (
    // Main container
    <div className="min-h-screen bg-blue flex items-center justify-center p-5">
      {/* Animated wrapper for the card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Birthday card */}
        <Card className="mx-auto overflow-hidden transition-all duration-250 ease-in-out hover:shadow-2xl border-2 border-black">
          {/* Card header with birthday message */}
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-black">Happy 48th Birthday!</CardTitle>
            <CardDescription className="text-2xl font-semibold text-brown-500">Asadullah Shafique</CardDescription>
            <p className="text-lg text-brown-400">February 3rd</p>
          </CardHeader>
          {/* Card content with candles and balloons */}
          <CardContent className="space-y-6 text-center">
            {/* Candles section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Light the candles:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through candles */}
                {[...Array(totalCandles)].map((_, index) => (
                  <AnimatePresence key={index}>
                    {/* Render lit or unlit candle based on state */}
                    {(celebrating && index <= candlesLit) || (!celebrating && index < candlesLit) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5, delay: celebrating ? index * 0.5 : 0 }}
                      >
                        {/* Lit candle */}
                        <FaBirthdayCake
                          className={`w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                          style={{ color: candleColors[index % candleColors.length] }}
                          onClick={() => lightCandle(index)}
                        />
                      </motion.div>
                    ) : (
                      // Unlit candle
                      <FaBirthdayCake
                        className={`w-8 h-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110`}
                        onClick={() => lightCandle(index)}
                      />
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
            {/* Balloons section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">Pop the balloons:</h3>
              <div className="flex justify-center space-x-2">
                {/* Map through balloons */}
                {[...Array(totalBalloons)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Balloon icon */}
                    <GiBalloons
                      className={`w-8 h-8 cursor-pointer hover:scale-110`}
                      style={{ color: index < balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }}
                      onClick={() => popBalloon(index)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
          {/* Card footer with celebrate button */}
          <CardFooter className="flex justify-center">
            <Button 
              className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
              onClick={celebrate}
              disabled={celebrating}
            >
              Celebrate! <FaGift className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      {/* Confetti component */}
      {showConfetti && (
        <DynamicConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={confettiColors}
        />
      )}
    </div>
  )
}

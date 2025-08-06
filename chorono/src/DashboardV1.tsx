import { useState, useEffect, useRef } from 'react'
import { Clock, Globe, Plus, Star } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'

type TimeZone = {
  id: string
  name: string
  offset: number
  location: string
  color: string
}

const popularTimeZones: TimeZone[] = [
  { id: 'utc', name: 'UTC', offset: 0, location: 'London, UK', color: 'bg-purple-500' },
  { id: 'et', name: 'Eastern Time', offset: -5, location: 'New York, USA', color: 'bg-blue-500' },
  { id: 'ct', name: 'Central Time', offset: -6, location: 'Chicago, USA', color: 'bg-green-500' },
  { id: 'pt', name: 'Pacific Time', offset: -8, location: 'Los Angeles, USA', color: 'bg-red-500' },
  { id: 'ist', name: 'India Time', offset: 5.5, location: 'Mumbai, India', color: 'bg-orange-500' },
  { id: 'cst', name: 'China Time', offset: 8, location: 'Shanghai, China', color: 'bg-yellow-500' }
]

const additionalTimeZones: TimeZone[] = [
  { id: 'aet', name: 'Sydney Time', offset: 10, location: 'Sydney, Australia', color: 'bg-pink-500' },
  { id: 'cet', name: 'Central Europe', offset: 1, location: 'Paris, France', color: 'bg-indigo-500' },
  { id: 'eat', name: 'East Africa', offset: 3, location: 'Nairobi, Kenya', color: 'bg-teal-500' },
  { id: 'msk', name: 'Moscow Time', offset: 3, location: 'Moscow, Russia', color: 'bg-amber-500' },
  { id: 'jst', name: 'Japan Time', offset: 9, location: 'Tokyo, Japan', color: 'bg-rose-500' },
  { id: 'brt', name: 'Brasília Time', offset: -3, location: 'Rio de Janeiro, Brazil', color: 'bg-emerald-500' }
]

const StarBackground = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 10 + 10
  }))

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: Math.random() * 0.6 + 0.4
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

const RotatingPlanet = () => {
  const rotate = useMotionValue(0)
  const scale = useMotionValue(1)
  
  useEffect(() => {
    const rotation = animate(rotate, 360, {
      duration: 60,
      repeat: Infinity,
      ease: "linear"
    })
    
    const scaling = animate(scale, [1, 1.05, 1], {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    })
    
    return () => {
      rotation.stop()
      scaling.stop()
    }
  }, [])

  return (
    <motion.div
      className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-900 to-purple-900 opacity-20 blur-xl"
      style={{ rotate }}
    />
  )
}

const TimeZoneCard = ({ tz, currentTime }: { tz: TimeZone, currentTime: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  const rotate = useMotionValue(0)
  
  useEffect(() => {
    if (isHovered) {
      animate(rotate, 10, { type: 'spring', stiffness: 300, damping: 10 })
    } else {
      animate(rotate, 0, { type: 'spring', stiffness: 300, damping: 10 })
    }
  }, [isHovered])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden h-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white">
        <motion.div
          className={`absolute -inset-8 rounded-full ${tz.color} opacity-0 blur-xl`}
          animate={{ 
            opacity: isHovered ? 0.2 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{tz.name}</h3>
              <p className="text-sm text-gray-400">{tz.location}</p>
            </div>
            <motion.div
              style={{ rotate }}
            >
              <Globe className="h-5 w-5 text-blue-300" />
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <motion.div
                key={currentTime}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold tracking-tight text-white"
              >
                {currentTime || '--:--:--'}
              </motion.div>
              <div className="text-sm text-gray-400 mt-2">
                UTC {tz.offset >= 0 ? '+' : ''}{tz.offset}
              </div>
            </div>
            <motion.div
              animate={{ scale: isHovered ? 1.2 : 1 }}
              className="text-4xl font-light text-blue-300"
            >
              {tz.offset >= 0 ? '+' : ''}{tz.offset}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function TimeZoneDashboard() {
  const [selectedTimeZones, setSelectedTimeZones] = useState<TimeZone[]>(popularTimeZones)
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({})
  const constraintsRef = useRef(null)

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()
      const newTimes: Record<string, string> = {}

      selectedTimeZones.forEach(tz => {
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000)
        const tzTime = new Date(utcTime + (3600000 * tz.offset))
        newTimes[tz.id] = tzTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      })

      setCurrentTimes(newTimes)
    }

    updateTimes()
    const intervalId = setInterval(updateTimes, 1000)

    return () => clearInterval(intervalId)
  }, [selectedTimeZones])

  const handleAddTimeZone = (value: string) => {
    const selectedTz = additionalTimeZones.find(tz => tz.id === value)
    if (selectedTz && !selectedTimeZones.some(tz => tz.id === selectedTz.id)) {
      setSelectedTimeZones([...selectedTimeZones, selectedTz])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8 overflow-hidden relative">
      <StarBackground />
      <RotatingPlanet />
      
      {/* Floating draggable clock */}
      <motion.div 
        className="absolute left-1/4 top-20 w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg cursor-grab"
        drag
        dragConstraints={constraintsRef}
        whileDrag={{ scale: 1.1 }}
        whileHover={{ scale: 1.05 }}
      >
        <Clock className="h-8 w-8 text-gray-900" />
      </motion.div>
      
      {/* Floating draggable globe */}
      <motion.div 
        className="absolute right-1/4 top-1/3 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg cursor-grab"
        drag
        dragConstraints={constraintsRef}
        whileDrag={{ scale: 1.1 }}
        whileHover={{ scale: 1.05 }}
      >
        <Globe className="h-6 w-6 text-white" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative" ref={constraintsRef}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="relative">
                    <Globe className="h-8 w-8 text-blue-400" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400"
                      animate={{ 
                        y: [0, -5, 0],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity
                      }}
                    />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Cosmic Time Dashboard</h1>
                  <p className="text-sm text-gray-400">
                    Track time across the universe
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-300" />
                  <span className="text-sm text-gray-300">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="w-full md:w-auto">
                  <Select onValueChange={handleAddTimeZone}>
                    <SelectTrigger className="w-full md:w-[280px] bg-gray-700 border-gray-600 text-white">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 90, 180, 270, 360] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        >
                          <Plus className="h-4 w-4 text-blue-300" />
                        </motion.div>
                        <SelectValue placeholder="Add time zone..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {additionalTimeZones.map(tz => (
                        <SelectItem 
                          key={tz.id} 
                          value={tz.id}
                          className="hover:bg-gray-700 focus:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${tz.color}`} />
                            <span>{tz.name} • {tz.location}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {selectedTimeZones.map(tz => (
              <TimeZoneCard
                key={tz.id}
                tz={tz}
                currentTime={currentTimes[tz.id]}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
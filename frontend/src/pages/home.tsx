import { BackgroundLines } from "@/components/ui/background-lines"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export const HomePage = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with overlay for better text readability on mobile */}
            <BackgroundLines children className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none" />
            
            {/* Main Content */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto py-12 sm:py-16 lg:py-20">
                
                {/* Heading with fade + slide up animation */}
                <h1 className={`mx-auto max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-blue-500 transition-all duration-1000 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    Upload your resume and get matched
                </h1>
                
                {/* Description with staggered animation */}
                <p className={`py-4 sm:py-6 mx-auto text-center max-w-xl px-4 text-base sm:text-lg md:text-xl text-zinc-600 font-normal leading-relaxed transition-all duration-1000 delay-200 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    Upload your resume to find jobs that match your skills. See job listings with a matching percentage to know which roles fit you best.
                </p>
                
                {/* CTA Buttons with animation */}
                <div className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-center mx-auto mt-6 sm:mt-8 max-w-md sm:max-w-none transition-all duration-1000 delay-400 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <Link to={"/uploadResume"} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto py-4 sm:py-5 px-8 sm:px-12 bg-blue-500 hover:bg-blue-700 active:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl">
                            Try now
                        </Button>
                    </Link>
                    
                    <a 
                        href="https://github.com/iAmBotOkkk/SkillfitAi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                    >
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto py-4 sm:py-5 px-6 sm:px-8 cursor-pointer hover:bg-gray-50  transition-all duration-300 border-2 "
                        >
                            <span className="text-sm sm:text-base font-medium">Stars Appreciated</span>
                            <Github className="size-5 sm:size-6 ml-2 group-hover:rotate-12 transition-transform duration-300" /> 
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    )
}
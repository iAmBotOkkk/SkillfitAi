import { Github } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/80 backdrop-blur-md' 
                : ''
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link 
                        to={"/"} 
                        className="text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-b from-blue-500 via-blue-700 to-black inline-block text-transparent bg-clip-text font-extrabold  transition-transform duration-300"
                    >
                        Skillfit AI
                    </Link>
                </div>
                
                {/* GitHub Link */}
                <a 
                    href="https://github.com/iAmBotOkkk/SkillfitAi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-all duration-300 p-2 sm:p-2.5 group"
                    aria-label="View on GitHub"
                >
                    <Github className="size-6 sm:size-7 group-hover:rotate-12 transition-transform duration-300" />
                </a>
            </div>
        </nav>
    )
}
import { Github } from "lucide-react"
import { href, Link } from "react-router-dom"
export const Navbar = () => {
    return (
        <nav className=" w-5xl m-auto px-4 py-4 flex justify-between  sticky top-0 z-30 ">
            <div>
                <Link to={"/"} className="text-4xl bg-gradient-to-b from-blue-500 via-blue-700 to-black inline-block text-transparent bg-clip-text font-bold">SkillFit AI</Link>
            </div>
             <Link to={href("https://github.com/iAmBotOkkk/SkillfitAi")}><Github/></Link>
        </nav>
    )
}
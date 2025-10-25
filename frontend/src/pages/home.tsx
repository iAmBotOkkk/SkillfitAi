import { BackgroundLines } from "@/components/ui/background-lines"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { Link } from "react-router-dom"


export const HomePage = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <BackgroundLines children className="absolute inset-0 w-full h-full mx-auto" />
            <div className="relative z-10 px-4 w-full ">
                <h1 className="mx-auto max-w-4xl text-center text-2xl font-bold leading-tight text-blue-500 md:text-4xl lg:text-7xl">
                    Upload your resume and get matched
                </h1>
                <p className=" py-4 mx-auto text-center max-w-xl text-lg font-normal  ">Upload your resume to find jobs that match your skills. See job listings with a matching percentage to know which roles fit you best.</p>
                <div className="flex justify-center gap-3 items-center mx-auto">
                    <Link to={"/uploadResume"}>
                    <Button className=" py-5  px-12 bg-blue-500 cursor-pointer  text-md ">Try now</Button>
                    </Link>
                    <a href="https://github.com/iAmBotOkkk/SkillfitAi"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Button variant={"outline"} className="py-5 cursor-pointer">Stars Appreciated <Github className="size-8 p-1" /> </Button>
                    </a>
                </div>
            </div>
        </div>
    )
}
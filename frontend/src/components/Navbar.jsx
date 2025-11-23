import {Link, useResolvedPath} from "react-router-dom"
import {GamepadDirectional, ShoppingBagIcon} from "lucide-react"

export default function Navbar(){
    const {pathname} = useResolvedPath()
    const isHomepage = pathname === "/"

    return( <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-conten/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
            <div className="navbar px-4 min-h-[4rem] justify-between">
                <div className="flex-1 lg:flex-none">
                    <Link to={"/"} className="hover:opacity-80 transition-opacity">
                        <div className="flex items-center gap-2">
                            <GamepadDirectional className="size-9 text-primary"/>
                            <span className="font-semibold font-mono tracking-widest text-2xl
                            bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                GAMESTORE
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <p>ThemeSelector</p>
                    {isHomepage  && (
                        <div className="indicator">
                            <ShoppingBagIcon className="size-5" />
                            <span className="badge badge-sm badge-primary indicator-item">
                                8
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    )
}
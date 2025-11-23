import { EditIcon, Trash2Icon } from "lucide-react"
import {Link} from "react-router-dom"

export default function GameCard({game}) {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="relative pt-[56.25%]">
                <img src={game.image_url} alt={game.title}
                className="absolute top-0 left-0 w-full h-full object-cover"
                />
            </figure>

            <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{game.title}</h2>
                {game.price && (
                    <p className="text-2xl font-bold text-primary">
                        {game.price > 0 ? `$${game.price}` : 'Free'}
                    </p>
                )}

                <div className="card-actions justify-end mt-4">
                    <Link to={`/games/${game.id}`} className="btn btn-sm btn-info btn-outline">
                        <EditIcon className="size-4" />
                    </Link>

                    <button className="btn btn-sm btn-error btn-outline">
                        <Trash2Icon className="size-4"/>
                    </button>
                </div>
            </div>
        </div>
    )
}
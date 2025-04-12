import { Link } from "react-router-dom";

interface BlogCardInput {
    id: number;
    authorName: Author;
    title: string;
    time: string;
    content: string;
    publishedDate: string;
}
export interface Author {
    details: {
        name: string;
        location: string;
        profession:string;
        userId:number;
        profileUrl : string;
        company : string;
    }
}

export const BlogCard = ({
    id,
    authorName,
    title,
    time,
    content,
}: BlogCardInput) => {
    let c = ''
    if (content.length > 100)
        c = content.slice(0, 100) + "......"
    else {
        c = content;
    }

    let readTime = Math.ceil(content.length / 100);
    let t = '';
    if (readTime < 60 && readTime > 0) {
        t = `${readTime} min. read`
    }
    else {
        t = `an hour read`
    }

    return <Link to={`/blog/${id}`}>
        <div className="p-2 border-2 rounded-3xl m-2 pb-4 border-purple-400 
            bg-gradient-to-tl from-violet-500 to-orange-300
            hover:bg-gradient-to-br from-violet-500 to-orange-300 
            cursor-pointer w-full max-w-screen-lg h-50 
            shadow-md shadow-gray-400 opacity-95 
            transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-xl 
             hover:brightness-110">
            <div className="m-1">

                <div className="flex pb-2 pt-2">
                    <div className="flex justify-center">
                        <Avatar name={authorName.details.name}></Avatar>
                    </div>
                    <div className="flex justify-center py-1.5">

                        <div className="py-1 pl-2 text-lg font-semibold hover:font-bold hover:cursor-pointer">{authorName.details.name}</div>
                        <div className="py-2.5 px-1.5 font-semibold text-white text-xs ">
                            &#9679;
                        </div>
                        <div className="pl-1 py-1.5 font-semibold flex justify-center">
                            {time}
                        </div>
                    </div>
                </div>
                <div className="text-2xl font-bold">
                    {title}
                </div>
                <div className="text-lg font-thin text-gray-900">
                    {c}
                </div>
                <div className="text-sm font-semibold pt-2 text-white">
                    {t}
                </div>
            </div>

        </div>
    </Link>
}


export function Avatar({ name, size = 12, color = "blue-200" }: { name: string, size?: number, color?: string }) {
    const bgColorClass = `bg-${color}`;
    const nameParts = name.split(" ");
    const first_name = nameParts[0][0].toUpperCase();
    const last_name = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : "";

    return (
        <div className={`relative inline-flex items-center justify-center w-${size} h-${size} overflow-hidden ${bgColorClass} rounded-2xl`}>
            <span className="font-medium text-black text-xl py-1">{first_name}{last_name}</span>
        </div>
    );
}
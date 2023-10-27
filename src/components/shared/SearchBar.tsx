'use client'
import Image from "next/image"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Props {
    routeType?: string
}
const SearchBar = ({ routeType }: Props) => {

    const [search, setSearch] = useState('')
    const router = useRouter()
    
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (search) {
            router.push(`/${routeType}?q=` + search);
          } else {
            router.push(`/${routeType}`);
          }
        }, 300);
    
        return () => clearTimeout(delayDebounceFn);
      }, [search, routeType]);

  
    return (
        <div className="w-full flex gap-2 justify-center items-center searchbar">
            <Input
                value={search}
                className=" no-focus searchbar_input bg-dark-2 text-light-1" 
                placeholder={`${routeType !== 'search' ? 'Search Communities...' : 'Search Creators...'}`}
                onChange={(e) => setSearch(e.target.value)}
            />
           
                <Image
                    src='/assets/search-gray.svg'
                    alt="search"
                    width={24}
                    height={24}
                />
        </div>
    )
}

export default SearchBar
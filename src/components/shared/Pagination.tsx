'use client'
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

interface Props {
    pageNumber: number
    isNext: boolean
    path: string
}
const Pagination = ({ pageNumber, isNext, path }: Props) => {

    const router = useRouter()

    const handleNavigation = (type: string) => {

        let nextPageNumber = pageNumber;

        if (type === 'prev') {
            nextPageNumber = Math.max(1, pageNumber - 1)
        } else if (type === 'next') {
            nextPageNumber = pageNumber + 1
        }


        if (nextPageNumber > 1) {
            router.push(`/${path}?page=${nextPageNumber}`)
        }
        else {
            router.push(`/${path}`)
        }

        if (!isNext && pageNumber === 1) return null
    }
    return (
        <div className="pagination">
            <Button
                className="!text-small-regular text-light-2 bg-primary-500 hover:bg-tertiary-500"
                disabled={pageNumber === 1}
                onClick={() => handleNavigation('prev')}
            >
                Previous Page
            </Button>
            <p className="!text-small-semibold text-light-1">Page {pageNumber}</p>
            <Button
                className="!text-small-regular text-light-2 bg-primary-500 hover:bg-tertiary-500"
                disabled={!isNext}
                onClick={() => handleNavigation('next')}
            >
                Next Page
            </Button>
        </div>
    )
}

export default Pagination

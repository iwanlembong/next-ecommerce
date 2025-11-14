"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const SearchBar = () => {

    const router = useRouter()

    const handleSearch = (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;  

        if(search){
            router.push(`/list?search=${search}`)
        }
    }

    return (
        <form className='flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1' onSubmit={handleSearch}>
            <input type='text' name='search' placeholder='Search' className='flex-1 bg-transparent outline-none' />
            <button className='cursor-pointer'>
                <Image src="/search.png" width={16} height={16} alt="" />
            </button>
        </form>
    )
}

export default SearchBar

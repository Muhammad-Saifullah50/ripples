"use client"
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const Bottombar = () => {
  const router = useRouter()
  const pathName = usePathname()
  return (
    <footer className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => {

          const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className='text-light-1 text-subtle-medium max-sm:hidden'>
                {link.label.split(/\s+/)[0]}</p> 
            </Link>)
        })}
      </div>
    </footer>
  )
}

export default Bottombar
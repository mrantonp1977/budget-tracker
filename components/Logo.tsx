import { PiggyBank } from 'lucide-react'
import React from 'react'

function Logo() {
  return (
    <a href="/" className="flex items-center gap-4">
      <PiggyBank className="stroke h-9 w-9 stroke-amber-500 stroke-[1.5]"/>
      <p className="bg-gradient-to-r from-green-500 to-amber-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent"> 
        My Finances
      </p>
    </a>
  )
}



export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-4">
      <p className="bg-gradient-to-r from-green-500 to-amber-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent"> 
        My Finances
      </p>
    </a>
  )
}

export default Logo;
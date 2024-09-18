import { LoaderCircle } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <LoaderCircle className="w-8 h-8 animate-spin"/>
    </div>
  )
}

export default loading
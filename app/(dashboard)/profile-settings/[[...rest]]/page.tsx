import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const SettingsPage = async () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-extrabold text-amber-500 mb-8 text-start">My Profile</h1>
      <UserProfile routing='hash'/>
    </div>
  )
}

export default SettingsPage
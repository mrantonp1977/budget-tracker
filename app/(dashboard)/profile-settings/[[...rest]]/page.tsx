import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@clerk/nextjs';
import React from 'react';

const SettingsPage = async () => {
  return (
    <div className="bg-card mt-16 px-8">
      <h1 className="text-3xl font-bold text-start dark:text-cyan-500">My Profile</h1>
      <p className="text-md text-muted-foreground">Change your profile photo and manage your account info</p>
      <Separator className="border-1 mt-8"/>
      <div className="flex flex-col items-center justify-center mt-16">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
};

export default SettingsPage;

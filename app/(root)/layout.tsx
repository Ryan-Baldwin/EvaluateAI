import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const session = await prismadb.session.findFirst({
    where: {
      userId,
    }
  });

  if (session) {
    redirect(`/${session.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};
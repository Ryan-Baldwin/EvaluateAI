import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import SessionSwitcher from "@/components/session-switcher";
import { MainNav } from "@/components/main-nav";
//import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";


const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const sessions = await prismadb.session.findMany({
    where: {
      userId,
    }
  });
  

  return ( 
    <div className="border-b">
      <div className="flex h-10 items-center px-4">
        <SessionSwitcher items={sessions} />
        <MainNav  />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
   );
}
 
export default Navbar;
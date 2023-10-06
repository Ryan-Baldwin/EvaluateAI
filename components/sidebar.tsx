import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { LibrarySVG, PersonSVG, BlocksSVG,PlaySVG, LinesSVG } from "./svgs"
import { useParams, usePathname } from "next/navigation";

export function Sidebar({ className,
   ...props
   }: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
      {
        href: `/${params.sessionId}/evaluate`,
        label: 'Evaluate',
        active: pathname === `/${params.sessionId}/evaluate`,
        svg: <PlaySVG />
      },
      {
        href: `/${params.sessionId}/playground`,
        label: 'playground',
        active: pathname === `/${params.sessionId}/playground`,
        svg: <PlaySVG />
      },
      {
        href: `/${params.sessionId}/embeddings`,
        label: 'Embeddings',
        active: pathname === `/${params.sessionId}/embeddings`,
        svg: <LinesSVG />
      },      
      {
        href: `/${params.sessionId}/similarity`,
        label: 'Text Similarity Search',
        active: pathname === `/${params.sessionId}/similarity`,
        svg: <LinesSVG />
      },      
      {
        href: `/${params.sessionId}/rag`,
        label: 'Retrieval Augmented Generation',
        active: pathname === `/${params.sessionId}/rag`,
        svg: <BlocksSVG />
      },
      {
        href: `/${params.sessionId}/extract`,
        label: 'Extract',
        active: pathname === `/${params.sessionId}/extract`,
        svg: <BlocksSVG />
      },
      

    ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Discover
            </h2>
            <div className="w-full px-1">
                <div className="space-y-1 p-2 flex flex-col">
                    {routes.map((route) => (
                        <Link key={route.href} href={route.href}>
                            <div
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center space-x-2',
                                    route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
                                )}
                            >
                                {route.svg}
                                <span>{route.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
          </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
            <LinesSVG />
              Critera Examples
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LinesSVG />
              Evaluation Examples
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <PersonSVG />
              Embedding Examples
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LibrarySVG />
              Datasets
            </Button>
          </div>
        </div>
                                    
      </div>
    </div>
  )
}

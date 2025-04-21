"use client"

import { usePathname } from "next/navigation"

export default function DashboardLayout({children}:Readonly<{children:React.ReactNode}>){
    const pathname = usePathname();

    return(
     <div>
        <h2>i am DashboardLayout {pathname }</h2>
        {children}
     </div>
    )
}



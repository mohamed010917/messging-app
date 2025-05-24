import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import Masseg from '@/mycomponents/masseg';
import MassegInput from '@/mycomponents/massegInput';
import { usePage } from '@inertiajs/react';
import { useEffect, useState, PropsWithChildren } from 'react';

import echo from "../../echo";

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    const page = usePage();
    const [user, setUser] = useState({});
    const [onlineUser, setOnlineUser] = useState({});





    const isUserOnline = (userId: number) => !!onlineUser[userId];

    useEffect(() => {
        if (!echo) {
            console.error("Echo is not initialized");
            return;
        }

        echo.join("online")
            .here(users => {
                const mapped = Object.fromEntries(users.map(us => [us.id, us]));
                setUser(mapped);
                setOnlineUser(mapped);
            })
            .joining(us => {
                setUser(prev => ({ ...prev, [us.id]: us }));
                setOnlineUser(prev => ({ ...prev, [us.id]: us }));
            })
            .leaving(us => {
                setUser(prev => {
                    const updated = { ...prev };
                    delete updated[us.id];
                    return updated;
                });
                setOnlineUser(prev => {
                    const updated = { ...prev };
                    delete updated[us.id];
                    return updated;
                });
            })
            .error(err => console.log(err));
    }, []);

    return (
        <AppShell variant="sidebar">
            <AppSidebar isUserOnline={isUserOnline} />
            <AppContent variant="sidebar">
                <AppSidebarHeader />
            
                <div className="p-4">
                    {
                        page.props.auth  ?
                            <>
                                <Masseg />
                                <MassegInput />
                            </>
                            :
                            <div className="text-center">
                               
                            </div>
                    }
                </div>
                {children}
            </AppContent>
        </AppShell>
    );
}


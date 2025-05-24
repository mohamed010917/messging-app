import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {  LayoutGrid } from 'lucide-react';

import React, { useEffect, useState } from 'react'

import echo from "../echo"


const footerNavItems: NavItem[] = [

];

export function AppSidebar(
    {
        isUserOnline ,
    }
) {



    const [mainNavItems, setMainNavItems] = useState([]);
    const page = usePage() ;
    const converstion = page.props.conversation ;
    const selectedConversation = page.props.selectedConversation ;
    const [localConversation, setLocalConversation] = useState([]) ;
    const [sortConvrstion, setSortConverstion] = useState([]) ;
    function search(e){
        console.log("search" , e.target.value) ;
        const value = e.target.value ;
        if(value.length > 0){
            const filterd = converstion.filter((item) => {
                return item.name.toLowerCase().includes(value.toLowerCase()) ;
            })
            setLocalConversation(filterd);
        }else{
            setLocalConversation( converstion );
        }

    }
    useEffect(() => {
        console.log("selectedConversation" , selectedConversation) ;
        setLocalConversation(converstion) ;
    },[converstion])
    useEffect(() => {
        console.log("localConversation" , localConversation) ;
        setMainNavItems(localConversation );
        setSortConverstion(
            localConversation.sort((a, b) => {
                if(a.blocked_at && b.blocked_at){
                    return a.blocked_at > b.blocked_at ? -1 : 1 
                }else if(a.blocked_at){
                    return 1 ;
                }else if(b.blocked_at){
                    return -1 ;
                }
                if(a.last_message_at && b.last_message_at){
                    return a.last_message_at > b.last_message_at ? -1 : 1
                }else if(a.last_message_at){
                    return 1 ;
                }else if(b.last_message_at){
                    return -1 ;
                }else{
                    return 0 ;
                }
            
            })
        ) ;
      
    },[localConversation])
 
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                            <LayoutGrid className="h-6 w-6" />
                                Home
                            </Link>
                            
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain search={search} isUserOnline={isUserOnline} items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

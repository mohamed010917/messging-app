import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { AvatarImage } from '@radix-ui/react-avatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function NavMain({ items = [] , search , isUserOnline}) {
   
    return (
        <SidebarGroup className=" py-0">
            <div className="search mb-2 mt-2">
                <input
                    onChange={ search}
                    name="search"
                    type="text"
                    className="w-full h-10 px-2 rounded-md border  border-gray-300 focus:outline-none focus:ring focus:ring-blue-50"
                    placeholder="Search..."
                />
            </div>

            <SidebarMenu>
                {items.map((item) => {
                const key = item.is_group ? "group_" + item.id : "user_" + item.id;
                    return (
                        <SidebarMenuItem key={
                          key
                        } >
                            <SidebarMenuButton   >
                                        {
                                            item.avatar ?
                                            <div className={`avatar mk ${item.is_user && isUserOnline(item.id) ? "avatar-online" : "avatar-offline"}`}>
                                                <div className="w-14 rounded-full">
                                                        <img src={`/storage/${item.avatar}`} alt={item.name} />

                                                </div>
                                                
                                            </div>
                                
                                            :
                                            <div className={`avatar mk ${item.is_user && isUserOnline(item.id) ? "avatar-online" : "avatar-offline"} avatar-placeholder`}>
                                            <div className="bg-neutral text-neutral-content w-14 rounded-full">
                                                <span className="text-3xl">{item.name.slice(0,1)}</span>
                                            </div>
                                            </div>
                                        }
                            
                                <Link href={item.is_user ? "/user_chat/" + item.id : "/group_chat/" + item.id } prefetch className='flex-col flex    rounded-md  '>
                                    
    
                                    <span className='block text-left w-[100%]  overflow-hidden text-ellipsis text-nowrap'>{item.name}</span>
                                
                                    <div className="flex ">
                                    <span className='block w-[80%]  overflow-hidden text-ellipsis text-nowrap'> {item.last_message?.message || ''}</span>
                                
                                    </div>
                                    <span className='block '>
                                    {dayjs(item.last_message_date).fromNow()}
                                    </span>
                                </Link>
                                
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )

                    
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

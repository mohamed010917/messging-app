
import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import echo from '@/echo';
import { toast } from 'react-toastify';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
      },
    ];

function ChatLayout() {
    const playNotificationSound = () => {
    const audio = new Audio('http://127.0.0.1:8000/bell-notification-337658.mp3');
    audio.play().catch(() => {});
  };

  const Page = usePage() ;
  const {auth} = Page.props ;
  const userId = auth.user.id ;

useEffect(() => {
  const channel = echo.private(`masseg.${userId}`);

  const callback = (e: any) => {
    if (e.masseg.sender_id !== auth.user.id) {
      toast.info(`${e.masseg.sender.name}: ${e.masseg.masseg?.slice(0, 60)}...`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      playNotificationSound();

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    }
  };

  channel.listen('notfi', callback);

  // 👇 تنظيف الاشتراك عند الخروج أو تغيير userId
  return () => {
    channel.stopListening('notfi', callback);
    echo.leave(`private-masseg.${userId}`);
  };
}, [userId]); // 🔁 يعتمد فقط على userId


    
  return (
    <AppLayout  breadcrumbs={breadcrumbs}>
        <Head title="home" />

    </AppLayout>
  )
}

export default ChatLayout
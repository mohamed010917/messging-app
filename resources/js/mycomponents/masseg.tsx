import { usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import echo from '@/echo';
import { toast } from 'react-toastify';
import { TrashIcon } from '@heroicons/react/24/solid';



function Masseg() {
  const page = usePage();
  const bottomRef = useRef(null);
  const { masseges, auth, user ,group} = page.props;
  if(!masseges){
    return (
      <div className="">

      </div>
    );
  }


  const [messages, setMessages] = useState(masseges.data);
  const sortedMessages = [...messages].sort((a, b) => a.id - b.id);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  



  if(user){
    useEffect(() => {
      const userId = auth.user.id;
      const receiverId = user ? user.id : null;
      const roomId = [userId, receiverId].sort((a, b) => a - b).join('-');
      const channel = echo.private(`masseg.user.${roomId}`);

  channel.listen('SoketMasseg', (e: any) => {
    setMessages((prevMessages) => {
      const exists = prevMessages.find(msg => msg.id === e.masseg.id);
      if (exists) return prevMessages;
      return [...prevMessages, e.masseg].sort((a, b) => a.id - b.id);
    });
  });
  
  
  
      return () => {
        channel.stopListening('SoketMasseg');
        echo.leave(`masseg.user.${roomId}`);
      };
    }, [auth.user.id, user.id]);
    
  }else if(group){
    useEffect(() => {
      const userId = auth.user.id;
      const group_id = group ? group.id : null;
      const channel = echo.private(`masseg.group.${group_id}`);
  channel.listen('SoketMasseg', (e: any) => {
    console.log(e) ;
    setMessages((prevMessages) => {
      const exists = prevMessages.find(msg => msg.id === e.masseg.id);
      if (exists) return prevMessages;
      return [...prevMessages, e.masseg].sort((a, b) => a.id - b.id);
    });
  });
  
  
  
      return () => {
        channel.stopListening('SoketMasseg');
        echo.leave(`masseg.group.${group_id}`);
      };
    }, [auth.user.id, group.id]);
  }



  useEffect(() => {
    const dinElement = document.querySelector(".din");
    const handleScroll = () => {
      if (dinElement.scrollTop === 0 && !isLoading) {
        const fetchOlderMessages = async () => {
          const firstMessageId = messages.reduce((minId, msg) => msg.id < minId ? msg.id : minId);
          if (!firstMessageId) return;
          setIsLoading(true);
          const prevScrollHeight = dinElement.scrollHeight;

          try {
            const response = await axios.get(`/load_older_messages/${firstMessageId.id}`);
            const older = response.data.data;

            setMessages((prev) => {
              const existingIds = new Set(prev.map(msg => msg.id));
              const newMessages = older.filter(msg => !existingIds.has(msg.id));
              return [...newMessages, ...prev];
            });
          
            setTimeout(() => {
              const newScrollHeight = dinElement.scrollHeight;
              dinElement.scrollTop = newScrollHeight - prevScrollHeight;
              setIsLoading(false);
            }, 50);
          } catch (error) {
            console.error("Error loading older messages:", error);
            setIsLoading(false);
          }
        };

        fetchOlderMessages();
      }
    };

    dinElement.addEventListener("scroll", handleScroll);
    return () => {
      dinElement.removeEventListener("scroll", handleScroll);
    };
  }, [messages, isLoading]);


  function handleDeleteMessage(messageId: number) {
     const dinElement = document.querySelector(".din");
       const prevScrollTop = dinElement.scrollTop;
     axios.post(`/delete_message/${messageId}`, {
        _method: 'delete'
     }) .then(() => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        setTimeout(() => {
   
      dinElement.scrollTop =  prevScrollTop;
      
    }, 50);
  })
  .catch((error) => {
    console.error("فشل حذف الرسالة:", error);
  });

  }

  console.log(masseges) ;

  return (
    <div className="p-4 overflow-y-scroll h-[calc(100vh-200px)] din relative bg-base-100 dark:bg-gray-900">
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 text-center text-xs text-gray-500 py-1 bg-base-200">
          جاري تحميل الرسائل القديمة...
        </div>
      )}

      {sortedMessages.map((msg: any) => {
        const isOwnMessage = msg.sender_id === auth.user.id;

        return (
          <div
            key={msg.id}
            className={`chat ${isOwnMessage ? 'chat-start' : 'chat-end'} mb-3`}
          >
            <div className="chat-image avatar">
              <div className="w-12 rounded-full border border-gray-300">
                <img src={`/storage/${msg.sender.avater}`} alt={msg.sender.name} />
              </div>
            </div>

            <div className="chat-header text-xs text-gray-500">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{msg.sender.name}</span>
              <time className="ml-2">{dayjs(msg.created_at).fromNow()}</time>
            </div>
    
            <div className="chat-bubble group max-w-lg break-words bg-gradient-to-r from-blue-100 to-blue-200 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800 text-gray-900 dark:text-white">
              {isOwnMessage && (
            <button
              onClick={() => handleDeleteMessage(msg.id)}
              className="absolute hidden group-hover:block cursor-pointer  mt-1 mr-1 text-red-500 hover:text-red-700 text-xs"
              style={{top: "-7px " , right: "-10px"}}
              title="Delete"
            >
                <TrashIcon className="h-6 w-6" />
            </button>
          )}

              <div className="your-custom-class">
                <ReactMarkdown>{msg.masseg}</ReactMarkdown>
              </div>
              {/* عرض المرفقات فقط دون النصوص */}
              {msg.attechment?.length > 0 && (
                <div className="mt-2 grid gap-2">
                  {msg.attechment.map((file: any, index: number) => {
                    const isImage = file.mime.startsWith('image/');
                    const isAudio = file.mime.startsWith('audio/');
                    const fileUrl = file.url;

                    if (isImage) {
                      return (
                        <a
                          key={`img-${msg.id}-${index}`}
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-xs border rounded overflow-hidden"
                        >
                          <img src={fileUrl} alt={file.name} className="rounded w-full object-cover" />
                        </a>
                      );
                    }

                    if (isAudio) {
                      return (
                        <div key={`audio-${msg.id}-${index}`} className=" p-4 rounded-lg shadow-lg w-full mt-2 flex items-center gap-2">
                          <div className="w-full">
                            <audio controls className="w-full" >
                              <source src={fileUrl} type={file.mime} />
                               <source src={fileUrl} type="audio/mp3" />
                                <source src="audio.mp3" type="audio/mpeg" />
                                <source src="audio.ogg" type="audio/ogg" />
                                <source src="audio.webm" type="audio/webm" />
                              متصفحك لا يدعم تشغيل الصوت.
                            </audio>
                          </div>
                        
                        </div>
                      );
                    }

                    return (
                      <a
                        key={`file-${msg.id}-${index}`}
                        href={fileUrl}
                        download
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 border rounded p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.293 14.707a1 1 0 001.414 0L12 12.414V17a1 1 0 102 0v-4.586l2.293 2.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z" />
                        </svg>
                        <span className="truncate">{file.name}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default Masseg;

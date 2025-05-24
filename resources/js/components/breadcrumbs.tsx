import { usePage } from "@inertiajs/react";
import React, { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export function Breadcrumbs() {
  const page = usePage() ;

  const [user , setuser] =  useState( page.props.user );
  const [group , setgroup] =  useState( page.props.group );
  
  
  
  if(user){
    const handleAction = (action) => {
      switch (action) {
        case "block":
          axios.post(`/block_user/${user.id}`).then((res) => {
           
            if (res.status ) {
             toast.info(`user blocked sucus`, {
                     position: "top-right",
                     autoClose: 3000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                   });
                 setuser((prevUser) => ({
                  ...prevUser,
                  blocked_at: Date.now(),
                }));
                  }else{
              toast.error(`user blocked filead`, {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
             
  
            }
          }).catch((err) => {
            console.log(err);
          });
          break;
        case "unblock":
          axios.post(`/block_user/${user.id}`).then((res) => {
            if (res.status === 200 ) {
                  toast.info(`user is un block`, {
                     position: "top-right",
                     autoClose: 3000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                   });  
                  setuser((prevUser) => ({
                  ...prevUser,
                  blocked_at: null,
                }));
                
            }else{
              toast.error(`user un blocked filead`, {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    user.blocked_at = null ;
             
            }
          }).catch((err) => {
            console.log(err);
          });
          break;
        default:
          break;
      }
    };
    return (
       <div className="w-full flex items-center justify-between  ">
          <div className="flex-1">
            <div className="flex items-center gap-4">

          {
          user.avatar ?
          <div className={`avatar mk`}>
              <div className="w-14 rounded-full">
                      <img src={`/storage/${user.avatar}`} />
              </div>
              
          </div>

          :
          <div className={`avatar mk  avatar-placeholder`}>
          <div className="bg-neutral text-neutral-content w-14 rounded-full">
              <span className="text-3xl">{  user.name.slice(0,1) }</span>
          </div>
          </div>
      }
          
              <div>
                <p className="font-bold text-lg">{ user.name }</p>
              </div>
            </div>
          </div>
     
          {
            page.props.auth.user.is_admin ? 
              <div className="">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm btn-ghost">
                    options
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    {
                      user.blocked_at ? 
                      <li>
                        <button onClick={() => handleAction("unblock")}>  un block</button>
                      </li>
                      :
                      <li>
                        <button onClick={() => handleAction("block")}>block  </button>
                      </li>
                    }
                    
                  </ul>
                </div>
              </div>
            : ""
          }
       </div>
       
      );
  }else if(group){
     return (
       <div className="w-full flex items-center justify-between  ">
          <div className="flex-1">
            <div className="flex items-center gap-4">

          {
         
          <div className={`avatar mk  avatar-placeholder`}>
          <div className="bg-neutral text-neutral-content w-14 rounded-full">
              <span className="text-3xl">{group.name.slice(0,1)}</span>
          </div>
          </div>
      }
          
              <div>
                <p className="font-bold text-lg">{ group.name}</p>
              </div>
            </div>
          </div>
    
       </div>
       
      );
  }
    
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function home(){
        
        return inertia('home');
    }

    public function block(string $id){
        if(auth()->user()->is_admin){
            $user = User::find($id);
            if($user){
                $user->blocked_at = $user->blocked_at ? null : now();
                $user->save();
                return redirect()->back()->with('message', 'User status updated successfully');
            }else{
                return redirect()->back()->with('error', 'User not found');
            }
        }
    }

}

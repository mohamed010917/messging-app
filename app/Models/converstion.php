<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class converstion extends Model
{
    protected $fillable = [
        'user_id1',
        'user_id2',
        "last_message_id",
    ];

    public function user1()
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2()
    {
        return $this->belongsTo(User::class, 'user_id2');
    }
    public function massegs()
    {
        return $this->hasMany(masseg::class);
    }
    public function lastMessage()
    {
        return $this->belongsTo(masseg::class, 'last_message_id');
    }
    public function group()
    {
        return $this->hasMany(group::class);
    }
    public static function getConvertionForSideBar(User $user){
        $users = User::getUsersExceptUser($user);
        $groups = group::getGroupsForUser($user);
        return $users->map(function ($user){
            return $user->toConverstionArray();
        })->merge($groups->map(function ($group) use ($user){
            return $group->toConverstionArray();
        }));
    }

    public static function updateConversationWithMasseg($userid1 , $userid2 , $masseg){
        $converstion = converstion::where(function ($query) use ($userid1 , $userid2){
            $query->where("user_id1" , $userid1)
             ->where("user_id2" , $userid2) ;
        })->orWhere(function ($query) use ($userid1 , $userid2){
            $query->where("user_id1" , $userid2)
            ->where("user_id2" , $userid1) ;
        })->first() ;
        if($converstion){
            $converstion->update([
                "last_message_id" => $masseg->id 
            ]);
        }else{
            converstion::create([
                "user_id1" => $userid1 ,
                "user_id2" => $userid2,
                "last_message_id" => $masseg->id 
            ]);
        }
    }
}

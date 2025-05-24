<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class group extends Model
{
    use HasFactory ;
    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id',
    ];
    public function users()
    {
        return $this->belongsToMany(User::class, 'group_users');
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    public function massegs()
    {
        return $this->hasMany(masseg::class);
    }
    public function lastMessage()
    {
        return $this->belongsTo(masseg::class, 'last_message_id');
    }
    public static function getGroupsForUser(User $user)
    {
       $quiery = self::select("groups.*" , "massegs.message as last_message", 
       "massegs.created_at as last_message_date")
         ->join("group_users" , "groups.id" , "=" , "group_users.group_id")
            ->leftJoin("massegs" , "groups.last_message_id" , "=" , "massegs.id")
            ->where("group_users.user_id" , "=" , $user->id)
            ->orderBy("massegs.created_at" , "desc")
            ->orderBy("groups.name" , "asc");
        return $quiery->get();
    }
    public function toConverstionArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            "is_group" => true,
            "is_user" => false,
            'owner_id' => $this->owner_id,
            "users" => $this->users ,
            "users_ids" => $this->users->pluck('id'),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            'last_message' => $this->lastMessage ,
            'last_message_date' => $this->lastMessage ? $this->lastMessage->created_at : null,
        ];
    }

    public static function updateGroupWithMasseg($group , $masseg){
        return self::updateOrCreate(["id" => $group ],[
            "last_message_id" => $masseg->id ,
        ]) ;
    }

}

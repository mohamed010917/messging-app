<?php

use App\Http\Resources\UserResource;
use App\Models\group;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel("online", function ($user) {
    return $user ?  new UserResource($user) : null ;
});

Broadcast::channel("masseg.user.{userid1}-{userid2}", function(User $user , int $userid1 , int $userid2){
    return $user->id == $userid1 || $user->id == $userid2 ? $user : null ;
});
Broadcast::channel("masseg.{userid1}", function( string $userid1 ){
    return $userid1  ;
});

Broadcast::channel("masseg.group.{groupid}", function(User $user , int $groupid){
    return $user->groups->contains("id" , $groupid) ? $user : null ;
});


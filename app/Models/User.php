<?php

namespace App\Models;

use Illuminate\Container\Attributes\Auth;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'avatar',
        "email_verified_at",
        "is_admin",
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups() : BelongsToMany
    {
        return $this->belongsToMany(group::class , "group_users" ); ;
    }
    public static function getUsersExceptUser(User $user) 
    {
        $user_id = $user->id;
        $quiery = user::select("users.*" , "massegs.message as last_message" , 
        "massegs.created_at as last_message_date")->where("users.id" , "!=" , $user_id)
        ->when(!$user->is_admin , function ($query)  {
            $query->whereNull("users.blocked_at");
        })
        ->leftJoin("converstions" , function ($join) use ($user_id) {
            $join->on("converstions.user_id1" , "=" , "users.id")
            ->where("converstions.user_id2" , "=" , $user_id)
            ->orWhere(function ($query) use ($user_id) {
                $query->on("converstions.user_id2" , "=" , "users.id")
                ->where("converstions.user_id1" , "=" , $user_id);
            });
        })->leftJoin("massegs" , function ($join) {
            $join->on("massegs.id" , "=" , "converstions.last_message_id");
        })
        ->orderByRaw('ifNull(users.blocked_at , 1) ')
        ->orderBy("massegs.created_at" , "desc")
        ->orderBy("users.name" , "asc");
        ;
        return $quiery->get();
    }
    public function toConverstionArray() : array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "is_group" => false,
            "is_user" => true,
            "is_admin" => $this->is_admin,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "blocked_at" => $this->blocked_at,
            "avatar" => $this->avatar,
            "last_message" => $this->last_message,
            "last_message_date" => $this->last_message_date,
        ];
    }
}

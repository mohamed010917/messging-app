<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class masseg extends Model
{
    use HasFactory ;
    protected $fillable = [
        'message',
        'sender_id',
        'resever_id',
        'group_id',
        'conversation_id',
    ];
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function resever()
    {
        return $this->belongsTo(User::class, 'resever_id');
    }
    public function group()
    {
        return $this->belongsTo(group::class, 'group_id');
    }
    public function conversation()
    {
        return $this->belongsTo(converstion::class, 'conversation_id');
    }

    public function attetchments()
    {
        return $this->hasMany(massegAttetchment::class);
    }
}

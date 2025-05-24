<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class massegAttetchment extends Model
{
    protected $fillable = [
        'masseg_id',
        'name',
        'path',
        'mime',
        'size',
    ];
}

<?php

namespace App\Events;

use App\Http\Resources\massegResource;
use App\Models\masseg;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SoketMasseg implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public masseg $masseg)
    {
        //
    }
    public function broadcastWith():array
    {
        return[
            "masseg" => new massegResource($this->masseg) ,
        ];
    }
    public function broadcastOn(): array
    {
       $m = $this->masseg ;
       $chanels = [] ;
       if($m->group_id){
         $chanels[] = new PrivateChannel("masseg.group." . $m->group_id) ;
       }else{
        $chanels[] =   new PrivateChannel("masseg.user." .
        collect([$m->resever_id , $m->sender_id])->sort()->implode("-")) ;
       }
       return $chanels ;
    }
}

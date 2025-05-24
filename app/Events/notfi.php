<?php

namespace App\Events;

use App\Http\Resources\massegResource;
use App\Models\group;
use App\Models\masseg;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class notfi  implements ShouldBroadcastNow
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
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
         $m = $this->masseg ;
       $chanels = [] ;
       if($m->group_id){
        $userIds = group::find($m->group_id)->users()->pluck("users.id");
            foreach ($userIds as $id) {
             $chanels[] = new PrivateChannel("masseg." . $id);
            }
       }else{
        $chanels[] =   new PrivateChannel("masseg." . $m->resever_id  );
       }
       return $chanels ;
    }
}

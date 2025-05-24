<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class massegResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "sender_id" => $this->sender_id,
            "resever_id" => $this->resever_id,
            "group_id" => $this->group_id,
            "masseg" => $this->message,
            "sender" => $this->sender ? new UserResource($this->sender) : null,
            "reciever" => $this->resever ? new UserResource($this->resever) : null,
            "attechment" => $this->attetchments ? massegAttechMentResource::collection($this->attetchments) : [],
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,

        ];
    }
}

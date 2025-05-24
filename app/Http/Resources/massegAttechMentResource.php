<?php

namespace App\Http\Resources;

use Illuminate\Container\Attributes\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class massegAttechMentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = null;
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "masseg_id" => $this->masseg_id,
            "name" => $this->name,
            "mime" => $this->mime,
            "size" => $this->size,
            "url" => $this->path,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "attechment_type" => $this->attechment_type,
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\notfi;
use App\Events\SoketMasseg;
use App\Http\Requests\storeMassegRequest;
use App\Http\Resources\massegResource;
use App\Models\converstion;
use App\Models\group;
use App\Models\masseg;
use App\Models\massegAttetchment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;



class massergController extends Controller
{
    public function ByUser(User $user)
    {

        $massegs = masseg::where(function($query) use ($user) {
            $query->where('sender_id', auth()->id())
                ->where('resever_id', $user->id);
        })->orWhere(function($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->where('resever_id', auth()->id());
        })->latest()->paginate(10);
       
        return inertia("home" , [
            "selectedConversation" => $user->toConverstionArray(),
            "masseges" =>  massegResource::collection($massegs),
            "user" => $user 
        ]) ;

    }

    

    public function ByGroup(group $group)
    {

       $massegs = masseg::where('group_id', $group->id)
        ->latest()->paginate(50);
        if(!$group->users->contains(auth()->id())){
            return abort(403);
        }
        return inertia("home" , [
            "selectedConversation" => $group->toConverstionArray(),
            "masseges" => massegResource::collection($massegs),
            "group" => $group  ,
          
        ]) ;
    }


    public function LoadOlderMessages(string $id)
    {


        $masseg = masseg::find($id) ;
        Log::info($id) ;
        if($masseg->group_id){
            $massegs = masseg::where('id',"<", $id)
            ->where("group_id" , $masseg->group_id)
            ->latest()->paginate(10);
        }else{
            $massegs = masseg::where('id',"<", $id)
            ->where(function($query) use ($masseg){
                 $query->where('sender_id', $masseg->sender_id)
                    ->where('resever_id', $masseg->resever_id);
                })
                ->orWhere(function($query) use ($masseg){
                 $query->where('sender_id', $masseg->resever_id)
                    ->where('resever_id', $masseg->sender_id);
                })
            ->latest()->paginate(10);
        
        }
        return["data" => massegResource::collection( $massegs )] ;
    }


    public function Store(storeMassegRequest $request)
    {
       
    
        $resiver = $request->resever_id ?? null;
        $group = $request->group_id ?? null;
        $files = $request->attechments ?? null;
        
        $masseg = masseg::create([
            "message" => $request->message ,
            "sender_id" => auth()->id() ,
            "group_id" => $group ,
            "resever_id" =>  $resiver

        ]);
        

        if($files){
           foreach($files as $file){
                $dir = "attechment/" . Str::random(32) ;
                Storage::makeDirectory($dir);
                massegAttetchment::create( [
                    "masseg_id" => $masseg->id,
                    "name" => $file->getClientOriginalName(),
                    "mime" => $file->getClientMimeType(),
                    "size" => $file->getSize(),
                    "path" => asset('storage/' . $file->store($dir, "public")),
                ]);
            }           
          
        }


        if($resiver){
            converstion::updateConversationWithMasseg($resiver , auth()->id() , $masseg);
        }



        if($group){
            group::updateGroupWithMasseg($group , $masseg);
        }

      
        SoketMasseg::dispatch($masseg) ;
        notfi::dispatch($masseg) ;


        return new massegResource($masseg);

    }


    public function Destroy(string $masseg)
    {
        $masseg = masseg::find($masseg);
        if($masseg->sender_id != auth()->id()){
            return response()->json([
                "message" => "you are not allowed to delete this masseg"
            ], 403);
         $masseg->delete();
            return response()->json([
                "message" => "masseg deleted successfully"
            ]);
        }
    }
}

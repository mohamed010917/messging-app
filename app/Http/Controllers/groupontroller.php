<?php

namespace App\Http\Controllers;

use App\Models\group;
use App\Models\User;
use Illuminate\Http\Request;

class groupontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
  
        return inertia("group",[
            "groups" => group::all() ,
            "users" => User::all() ,
        ]) ;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function addusers( string $group_id , Request $request)
    {
        $request->validate([
            "user_ids" => "required|array",
        ]);

        $group = group::find($group_id);
        if ($group) {
            $group->users()->syncWithoutDetaching($request->user_ids);
            return response()->json([
                "message" => "Users added to group successfully",
                "group" => $group,
            ]);
        } else {
            return response()->json([
                "message" => "Group not found",
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "description" => "required|string|max:255",
            
        ]);

        $group = group::create([
            "name" => $request->name,
            "description" => $request->description,
            "owner_id" => auth()->user()->id,
        ]);

        return response()->json([
            "message" => "Group created successfully",
            "group" => $group,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json([
            "group" => group::with("users")->find($id),
   
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function removeuser(string $targetGroupId , string $userId)
    {
        $group = group::find($targetGroupId);
        if ($group) {
            $group->users()->detach($userId);
            return response()->json([
                "message" => "User removed from group successfully",
                "group" => $group,
            ]);
        } else {
            return response()->json([
                "message" => "Group not found",
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "description" => "required|string|max:255",
            
        ]);

        $group = group::find($id);
        $group->name = $request->name;
        $group->description = $request->description;
        $group->save();
        return response()->json([
            "message" => "Group updated successfully",
            "group" => $group,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $group = group::find($id) ;
        if($group){
            $group->delete() ;
            return response()->json([
                "masseg" => true 
            ],200) ;
        }else{
            return response()->json([
                "masseg" => false ,
            ],402) ;
        }
    }
}

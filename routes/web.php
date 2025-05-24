<?php

use App\Http\Controllers\groupontroller;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\massergController;
use App\Http\Controllers\VideoCallController;
use App\Http\Middleware\admin;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class , "home"])->name('home');
    route::get("/user_chat/{user}", [massergController::class , "byUser"])->name('user_messages');
    route::get("/group_chat/{group}", [massergController::class , "byGroup"])->name('group_messages');
    route::get("/load_older_messages/{id}", [massergController::class , "loadOlderMessages"])->name('load_older_messages');
    route::post("/store_message", [massergController::class , "store"])->name('store_message');
    route::delete("/delete_message/{id}", [massergController::class , "destroy"])->name('delete_message');
    route::post("/block_user/{id}", [HomeController::class , "block"])->name('block_user');
    route::Resource("group",groupontroller::class)->middleware(admin::class) ;
    route::post("group/{group_id}/users",[groupontroller::class , "addusers"])->middleware(admin::class) ;
    route::post("/group/{targetGroupId}/users/{userId}",[groupontroller::class , "removeuser"])->middleware(admin::class) ;

});





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

<?php

namespace Database\Seeders;

use App\Models\converstion;
use App\Models\group;
use App\Models\masseg;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            "password" => bcrypt('password'),
            "is_admin" => 1,
        ]);
        User::factory()->create([
            'name' => 'Test User',
            "password" => bcrypt('password'),
            'email' => 'two@example.com',
        ]);
        User::factory(40)->create();
        for($i = 0 ; $i < 5 ;$i++){
            $group = group::factory()->create([
                "owner_id" => 1,
            ]);
            $users = User::inRandomOrder()->limit(rand(2,5))->pluck("id");
            $group->users()->attach(array_unique($users->toArray()));
        
        }
        $massages = masseg::factory(1000)->create();
        $conversations = $massages->groupBy(function ($masseg){
            return collect([$masseg->sender_id, $masseg->resever_id])->sort()->implode('-');
        })->map(function ($m){
            return [
                "user_id1" => $m->first()->sender_id,
                "user_id2" => $m->first()->resever_id,
                "created_at" => new Carbon(),
                "updated_at" => new Carbon(),
                "last_message_id" => $m->last()->id,
            ] ;
        })->values() ;
        converstion::insertOrIgnore($conversations->toArray());
    }
}

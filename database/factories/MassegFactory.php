<?php

namespace Database\Factories;

use App\Models\group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Masseg>
 */
class MassegFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sender = fake()->numberBetween(0, 1);
        if($sender === 0){
            $sender = fake()->randomElement(User::pluck('id')->toArray());
            $receiver = 1;
        }else{
            $receiver = fake()->randomElement(User::pluck('id')->toArray());
        }
        $group_id = null ;
        $conversation = null;
        if(fake()->boolean(50)){
            $group_id = fake()->randomElement(group::pluck('id')->toArray());
            $group = group::find($group_id);
            $sender = fake()->randomElement($group->users->pluck('id')->toArray());
            $receiver = null ;
        }
        return [
            "sender_id" => $sender,
            "resever_id" => $receiver,
            "group_id" => $group_id,
            "conversation_id" => $conversation,
            "message" => fake()->sentence(),
            "created_at" => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}

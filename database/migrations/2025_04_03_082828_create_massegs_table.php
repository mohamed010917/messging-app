<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('massegs', function (Blueprint $table) {
            $table->id();
            $table->longText('message')->nullable();
            $table->foreignId('sender_id')->constrained('users')->onDelete("cascade");
            $table->foreignId('resever_id')->nullable()->constrained('users')->onDelete("cascade");
            $table->foreignId("group_id")->nullable()->constrained('groups')->onDelete("cascade");
            $table->foreignId('conversation_id')->nullable()->constrained('converstions')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::table("groups", function (Blueprint $table){
            $table->foreignId("last_message_id")->nullable()->constrained("massegs")->onDelete("cascade");
        });
        Schema::table("converstions", function (Blueprint $table){
            $table->foreignId("last_message_id")->nullable()->constrained("massegs")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->dropForeign(['last_message_id']);
        });
        
        Schema::table('converstions', function (Blueprint $table) {
            $table->dropForeign(['last_message_id']);
        });
        Schema::dropIfExists('massegs');
    }
};

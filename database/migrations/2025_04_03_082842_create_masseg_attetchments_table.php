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
        Schema::create('masseg_attetchments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('masseg_id')->constrained('massegs')->onDelete('cascade');
            $table->string('name');
            $table->string('path');
            $table->string('mime');
            $table->string('size');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('masseg_attetchments');
    }
};

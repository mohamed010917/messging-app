<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
 public function update(ProfileUpdateRequest $request)
{
    Log::info('Profile update request', [
        'user_id' => $request->user()->id,
        'data' => $request->validated(),
    ]);

    $user = $request->user();

    // املأ البيانات (name, email)
    $user->fill($request->validated());

    // إذا تم رفع صورة، خزّنها في التخزين العام وحدث المسار في قاعدة البيانات
    if ($request->hasFile('image')) {
        $imagePath =  $request->file('image')->store('avatars', 'public');
        $user->avatar = $imagePath;
    }

    // إذا تم تغيير البريد الإلكتروني، أعد تعيين حالة التحقق
    if ($user->isDirty('email')) {
        $user->email_verified_at = null;
    }

    $user->save();

    return response()->json([
        'status' => 'Profile updated successfully.',
    ]);
}


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

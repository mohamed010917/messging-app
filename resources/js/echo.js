import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
    forceTLS: false,  // ⚠️ تأكد أن هذا هو `false`
    disableStats: true,
    enabledTransports: ['ws'],
});

export default echo;


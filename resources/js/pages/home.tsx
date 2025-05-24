import ChatLayout from '@/layouts/chat/ChatLayout';

import { Head } from '@inertiajs/react';

export default function Home() {

    return (
        <>
            <Head title="Welcome">
                
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <ChatLayout />
        </>
    );
}

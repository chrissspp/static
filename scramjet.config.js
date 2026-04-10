/**
 * Scramjet Proxy Configuration
 * This file coordinates the prefix and encoding between the 
 * frontend and the service worker.
 */

self.__scramjet$config = {
    // This is the 'virtual' folder that the service worker intercepts
    prefix: '/service/',
    
    // The codec used to scramble URLs so filters don't flag them
    // 'xor' is the standard for Scramjet
    codec: 'xor',
    
    // The path to the worker scripts
    config: './scramjet.config.js',
    sw: './sw.js',
    
    /**
     * URL Encoder/Decoder
     * This mimics the Scramjet internal logic to ensure 
     * the frontend sends URLs in a format the worker understands.
     */
    encodeUrl: (str) => {
        if (!str) return str;
        return encodeURIComponent(
            str.split('').map((char, i) => 
                i % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
            ).join('')
        );
    },
    
    decodeUrl: (str) => {
        if (!str) return str;
        const [path, ...search] = str.split('?');
        return (
            decodeURIComponent(path)
                .split('')
                .map((char, i) => 
                    i % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
                )
                .join('') + (search.length ? '?' + search.join('?') : '')
        );
    }
};

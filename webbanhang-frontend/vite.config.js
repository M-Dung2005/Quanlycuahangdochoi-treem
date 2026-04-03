import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:5000';

    return {
        plugins: [react()],
        server: {
            port: 5173,
            host: true, // cho phép truy cập từ network local
            proxy: {
                '/api': {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: false,       // bỏ qua SSL cert check (dev)
                    ws: false,           // không proxy WebSocket
                },
            },
        },
    };
});

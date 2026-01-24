import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

interface TruckPosition {
    plateNumber: string;
    lat: number;
    lng: number;
    speed: number;
    heading: string;
    location: string;
    status: string;
    lastUpdate?: string;
}

interface Notification {
    id: number;
    type: string;
    message: string;
    timestamp: string;
}

let socket: Socket | null = null;

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [truckPositions, setTruckPositions] = useState<Record<string, TruckPosition>>({});
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Initialize socket connection
        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('🔌 Connected to realtime service');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from realtime service');
            setIsConnected(false);
        });

        socket.on('initial_positions', (positions: Record<string, TruckPosition>) => {
            setTruckPositions(positions);
        });

        socket.on('truck_position', (data: TruckPosition) => {
            setTruckPositions((prev) => ({
                ...prev,
                [data.plateNumber]: data,
            }));
        });

        socket.on('notification', (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
        });

        socket.on('heartbeat', (data: { timestamp: string; trucks: number }) => {
            console.log('💓 Heartbeat:', data);
        });

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, []);

    const subscribeTruck = useCallback((plateNumber: string) => {
        if (socket) {
            socket.emit('subscribe_truck', plateNumber);
        }
    }, []);

    const unsubscribeTruck = useCallback((plateNumber: string) => {
        if (socket) {
            socket.emit('unsubscribe_truck', plateNumber);
        }
    }, []);

    const sendNotification = useCallback((type: string, message: string) => {
        if (socket) {
            socket.emit('send_notification', { type, message });
        }
    }, []);

    return {
        isConnected,
        truckPositions,
        notifications,
        subscribeTruck,
        unsubscribeTruck,
        sendNotification,
    };
}

export function getSocket(): Socket | null {
    return socket;
}

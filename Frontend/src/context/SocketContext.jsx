import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketDataContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
        const role = window.location.pathname.startsWith('/captain') ? 'captain' : 'user';
        const token = localStorage.getItem(`${role}Token`) || localStorage.getItem('token');

        if (!token) return;

        const newSocket = io(backendUrl, {
            auth: {
                token,
                role
            },
            autoConnect: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const connectSocketWithToken = (token, role) => {
        if (socket) {
            socket.disconnect();
        }
        // Keep independent persistent sessions so a user and captain can use
        // separate tabs of the same browser without overwriting one another.
        localStorage.setItem(`${role}Token`, token);
        localStorage.setItem('token', token); // compatibility with older sessions
        localStorage.setItem('role', role);

        const backendUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
        const newSocket = io(backendUrl, {
            auth: { token, role },
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(newSocket);
    };

    const sendMessage = (eventName, data) => {
        if (socket) {
            socket.emit(eventName, data);
        }
    };

    const receiveMessage = (eventName, callback) => {
        if (socket) {
            socket.on(eventName, callback);
        }
    };

    return (
        <SocketDataContext.Provider value={{ socket, isConnected, connectSocketWithToken, sendMessage, receiveMessage }}>
            {children}
        </SocketDataContext.Provider>
    );
};

export default SocketProvider;

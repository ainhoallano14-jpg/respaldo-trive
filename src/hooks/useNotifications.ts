import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking' | 'trip_update' | 'driver_arrived' | 'trip_completed' | 'review_pending' | 'message';
  title: string;
  message: string;
  data?: {
    route_id?: string;
    booking_id?: string;
    other_user_id?: string;
    [key: string]: any;
  };
  is_read: boolean;
  created_at: string;
}

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Obtener notificaciones
  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      setError(null);
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setNotifications(data || []);

      // Contar no leídas
      const unread = (data || []).filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err: any) {
      const message = err.message || 'Error al cargar notificaciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Marcar como leída
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking as read:', err.message);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );

      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all as read:', err.message);
    }
  };

  // Eliminar notificación
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );

      setUnreadCount((prev) => {
        const isUnread = notifications.find((n) => n.id === notificationId)?.is_read === false;
        return isUnread ? Math.max(0, prev - 1) : prev;
      });
    } catch (err: any) {
      console.error('Error deleting notification:', err.message);
    }
  };

  // Crear notificación
  const createNotification = async (
    userId: string,
    notificationData: Omit<Notification, 'id' | 'created_at'>
  ) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;

      // Actualizar estado local
      setNotifications((prev) => [data, ...prev]);

      if (!data.is_read) {
        setUnreadCount((prev) => prev + 1);
      }

      return data;
    } catch (err: any) {
      console.error('Error creating notification:', err.message);
      throw err;
    }
  };

  // Escuchar cambios en tiempo real
  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    // Suscribirse a cambios
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotif = payload.new as Notification;
            setNotifications((prev) => [newNotif, ...prev]);
            if (!newNotif.is_read) {
              setUnreadCount((prev) => prev + 1);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Notification;
            setNotifications((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n))
            );
            const oldUnread = payload.old?.is_read === false;
            const newUnread = updated.is_read === false;
            if (oldUnread && !newUnread) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Notification;
            setNotifications((prev) =>
              prev.filter((n) => n.id !== deleted.id)
            );
            if (deleted.is_read === false) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  };
};

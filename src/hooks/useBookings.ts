import { useState } from "react";
import { supabase } from "../services/supabase";

export interface Booking {
  id: string;
  route_id: string;
  passenger_id: string;
  seat_number: number;
  price: number;
  payment_method?: string;
  payment_status: string;
  booking_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (
    routeId: string,
    passengerId: string,
    seatNumber: number,
    price: number,
    paymentMethod: string = "cash"
  ) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            route_id: routeId,
            passenger_id: passengerId,
            seat_number: seatNumber,
            price,
            payment_method: paymentMethod,
            payment_status: "pending",
            booking_status: "confirmed",
          },
        ])
        .select()
        .single();

      if (bookingError) {
        // Manejar error de asiento ya reservado
        if (bookingError.code === '23505' || bookingError.message.includes('unique')) {
          const customError = new Error('Este asiento ya fue reservado. Por favor selecciona otro.');
          customError.code = 'SEAT_ALREADY_RESERVED';
          throw customError;
        }
        throw bookingError;
      }

      // Update available_seats in routes
      const { error: updateError } = await supabase.rpc(
        "decrement_available_seats",
        {
          route_id: routeId,
        }
      );

      if (updateError) {
        // Fallback: manually update if RPC doesn't exist
        await supabase
          .from("routes")
          .update({ available_seats: (prev: number) => prev - 1 })
          .eq("id", routeId);
      }

      return data;
    } catch (err: any) {
      const message = err.message || "Error creating booking";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPassengerBookings = async (passengerId: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(`*, routes:route_id(*)`)
        .eq("passenger_id", passengerId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      return data;
    } catch (err: any) {
      const message = err.message || "Error fetching bookings";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getRouteBookings = async (routeId: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(`*`)
        .eq("route_id", routeId)
        .eq("booking_status", "confirmed");

      if (fetchError) throw fetchError;
      return data;
    } catch (err: any) {
      const message = err.message || "Error fetching route bookings";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: updateError } = await supabase
        .from("bookings")
        .update({ booking_status: "cancelled", payment_status: "refunded" })
        .eq("id", bookingId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Increment available_seats
      // Get the route_id from booking
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("route_id")
        .eq("id", bookingId)
        .single();

      if (bookingData) {
        await supabase
          .from("routes")
          .update({ available_seats: (prev: number) => prev + 1 })
          .eq("id", bookingData.route_id);
      }

      return data;
    } catch (err: any) {
      const message = err.message || "Error cancelling booking";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBooking,
    getPassengerBookings,
    getRouteBookings,
    cancelBooking,
  };
};

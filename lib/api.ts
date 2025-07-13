import { supabase } from "./supabase"
import type { User, MembershipPayment, Donation, Accident, Notification, GalleryImage } from "./supabase"

// Users API
export const usersAPI = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async approve(id: string): Promise<User> {
    return this.update(id, { status: "approved", membership_status: "active" })
  },

  async reject(id: string): Promise<User> {
    return this.update(id, { status: "rejected" })
  },
}

// Membership Payments API
export const paymentsAPI = {
  async getAll(): Promise<MembershipPayment[]> {
    const { data, error } = await supabase
      .from("membership_payments")
      .select(`
        *,
        users (
          id,
          name,
          phone,
          store_name,
          location
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(payment: Omit<MembershipPayment, "id" | "created_at">): Promise<MembershipPayment> {
    const { data, error } = await supabase.from("membership_payments").insert(payment).select().single()

    if (error) throw error
    return data
  },

  async approve(id: string, approvedBy: string): Promise<MembershipPayment> {
    const { data, error } = await supabase
      .from("membership_payments")
      .update({
        status: "approved",
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async reject(id: string): Promise<MembershipPayment> {
    const { data, error } = await supabase
      .from("membership_payments")
      .update({ status: "rejected" })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// Donations API
export const donationsAPI = {
  async getAll(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from("donations")
      .select(`
        *,
        users (
          id,
          name,
          phone,
          store_name,
          location
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(donation: Omit<Donation, "id" | "created_at">): Promise<Donation> {
    const { data, error } = await supabase.from("donations").insert(donation).select().single()

    if (error) throw error
    return data
  },

  async approve(id: string, approvedBy: string): Promise<Donation> {
    const { data, error } = await supabase
      .from("donations")
      .update({
        status: "approved",
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async reject(id: string): Promise<Donation> {
    const { data, error } = await supabase
      .from("donations")
      .update({ status: "rejected" })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// Accidents API
export const accidentsAPI = {
  async getAll(): Promise<Accident[]> {
    const { data, error } = await supabase
      .from("accidents")
      .select(`
        *,
        users (
          id,
          name,
          phone,
          store_name,
          location
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(accident: Omit<Accident, "id" | "created_at" | "updated_at">): Promise<Accident> {
    const { data, error } = await supabase.from("accidents").insert(accident).select().single()

    if (error) throw error
    return data
  },
}

// Notifications API
export const notificationsAPI = {
  async getAll(): Promise<Notification[]> {
    const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(notification: Omit<Notification, "id" | "created_at" | "is_read">): Promise<Notification> {
    const { data, error } = await supabase
      .from("notifications")
      .insert({ ...notification, is_read: false })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("notifications").delete().eq("id", id)

    if (error) throw error
  },
}

// Gallery API
export const galleryAPI = {
  async getAll(): Promise<GalleryImage[]> {
    const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(image: Omit<GalleryImage, "id" | "created_at">): Promise<GalleryImage> {
    const { data, error } = await supabase.from("gallery").insert(image).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("gallery").delete().eq("id", id)

    if (error) throw error
  },
}

// File upload API
export const uploadAPI = {
  async uploadImage(file: File, bucket: string, path: string): Promise<string> {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return publicUrl
  },
}

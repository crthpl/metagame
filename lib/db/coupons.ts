import { createServiceClient } from "@/utils/supabase/service"

export const couponsService = {
  getByCode: async ({ couponCode }: { couponCode: string }) => {
    const supabase = createServiceClient()
    console.log()
    const { data, error } = await supabase.from('coupons').select('*').eq('coupon_code', couponCode).maybeSingle()
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
  getAll: async ({ enabledOnly }: { enabledOnly: boolean} = {enabledOnly: true}) => {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('coupons').select('*').eq('enabled', enabledOnly)
    if (error) {
      throw new Error(error.message)
    }
    return data
  },
  /** Check all coupon email authoriation for a given email address */
  checkEmailAuthorization: async ({ couponId, email }: { couponId: string, email: string }) => {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('coupon_emails').select().eq('coupon_id', couponId).eq('email', email).maybeSingle()
    if (error) {
      throw new Error(error.message)
    }
    return data
  }
}
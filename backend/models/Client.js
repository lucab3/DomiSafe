const supabase = require('../config/supabase');

class Client {
  static async findAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        services (
          id,
          service_date,
          status,
          employee:employees(name, phone)
        ),
        reviews (
          id,
          rating,
          comment,
          employee:employees(name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updatePreferences(id, preferences) {
    const { data, error } = await supabase
      .from('clients')
      .update({ 
        preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSubscription(id, subscriptionData) {
    const { data, error } = await supabase
      .from('clients')
      .update({ 
        subscription_type: subscriptionData.type,
        subscription_end_date: subscriptionData.endDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async addReferralCode(id, referralCode) {
    const { data, error } = await supabase
      .from('clients')
      .update({ 
        referral_code: referralCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = Client;
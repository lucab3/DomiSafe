const supabase = require('../config/supabase');

class Employee {
  static async findAll(filters = {}) {
    let query = supabase
      .from('employees')
      .select(`
        *,
        reviews (
          rating,
          comment,
          created_at
        ),
        services_count:services(count)
      `)
      .eq('is_active', true);

    if (filters.zone) {
      query = query.ilike('zone', `%${filters.zone}%`);
    }

    if (filters.services) {
      query = query.contains('services_offered', filters.services);
    }

    if (filters.min_rating) {
      query = query.gte('average_rating', filters.min_rating);
    }

    if (filters.languages) {
      query = query.contains('languages', filters.languages);
    }

    const { data, error } = await query.order('average_rating', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        reviews (
          id,
          rating,
          comment,
          created_at,
          client:clients(name)
        ),
        services (
          id,
          service_date,
          status,
          client:clients(name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(employeeData) {
    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { data, error } = await supabase
      .from('employees')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByLocation(latitude, longitude, radiusKm = 10) {
    const { data, error } = await supabase
      .rpc('employees_near_location', {
        lat: latitude,
        lng: longitude,
        radius_km: radiusKm
      });

    if (error) throw error;
    return data;
  }

  static async updateAvailability(id, availability) {
    const { data, error } = await supabase
      .from('employees')
      .update({ 
        availability: availability,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRating(employeeId) {
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('employee_id', employeeId);

    if (reviewsError) throw reviewsError;

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      const { data, error } = await supabase
        .from('employees')
        .update({ 
          average_rating: Math.round(avgRating * 10) / 10,
          total_reviews: reviews.length
        })
        .eq('id', employeeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    
    return null;
  }
}

module.exports = Employee;
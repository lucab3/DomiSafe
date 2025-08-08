const Employee = require('../models/Employee');

class EmployeeService {
  static async getEmployees(filters) {
    const { latitude, longitude, radius } = filters;
    
    // Obtener empleadas de la base de datos
    const employees = await Employee.findAll(filters);

    // Si hay coordenadas, calcular distancias
    let result = employees;
    if (latitude && longitude) {
      result = Employee.processEmployeesWithDistance(
        employees, 
        latitude, 
        longitude, 
        radius
      );
    }

    return {
      employees: result,
      count: result.length,
      filters_applied: Object.keys(filters).filter(key => filters[key] !== undefined)
    };
  }

  static async getEmployeeById(id) {
    return await Employee.findById(id);
  }

  static async toggleEmployeeStatus(id, isActive) {
    return await Employee.updateStatus(id, isActive);
  }

  static async getNearbyEmployees(latitude, longitude, radius = 10) {
    const employees = await Employee.findAll();
    
    return Employee.processEmployeesWithDistance(
      employees,
      latitude,
      longitude,
      radius
    );
  }
}

module.exports = EmployeeService;
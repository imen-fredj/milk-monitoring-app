export const validateMeasurement = (req, res, next) => {
  const { temperature, pH, weight } = req.body;
  
  const errors = [];
  
  if (typeof temperature !== 'number' || temperature < 0 || temperature > 50) {
    errors.push('Temperature must be a number between 0 and 50');
  }
  
  if (typeof pH !== 'number' || pH < 0 || pH > 14) {
    errors.push('pH must be a number between 0 and 14');
  }
  
  if (typeof weight !== 'number' || weight < 0) {
    errors.push('Weight must be a positive number');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};
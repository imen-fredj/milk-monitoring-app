import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Measurement from '../models/Measurement.js';




////////////////////////////////////////////// Helper Functions ////////////////////////////////////////////


const calculateAverage = (data, field) => {
  if (!data || data.length === 0) return 0;
  const values = data.map(item => item[field]).filter(val => val !== null && val !== undefined && !isNaN(val));
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
  return parseFloat((sum / values.length).toFixed(2));
};

// Group measurements by time periods
const groupMeasurementsByPeriod = (measurements, periodHours) => {
  if (measurements.length === 0) return [];
  
  const periodMs = periodHours * 60 * 60 * 1000; // Convert hours to milliseconds
  const periods = [];
  
  // Get the start of the first period
  const firstMeasurement = measurements[0];
  const firstPeriodStart = new Date(firstMeasurement.timestamp);
  firstPeriodStart.setMinutes(0, 0, 0); // Round to hour
  
  // Adjust to period boundaries (00:00 and 12:00 for 12h periods)
  const hourOfDay = firstPeriodStart.getHours();
  if (periodHours === 12) {
    firstPeriodStart.setHours(hourOfDay < 12 ? 0 : 12);
  } else if (periodHours === 24) {
    firstPeriodStart.setHours(0);
  }
  
  let currentPeriodStart = new Date(firstPeriodStart);
  let lastMeasurementTime = new Date(measurements[measurements.length - 1].timestamp);
  
  while (currentPeriodStart <= lastMeasurementTime) {
    const periodEnd = new Date(currentPeriodStart.getTime() + periodMs);
    
    // Get measurements for this period
    const periodMeasurements = measurements.filter(m => {
      const measurementTime = new Date(m.timestamp);
      return measurementTime >= currentPeriodStart && measurementTime < periodEnd;
    });
    
    if (periodMeasurements.length > 0) {
      // Calculate statistics for this period
      const stats = calculatePeriodStatistics(periodMeasurements);
      
      periods.push({
        id: `${currentPeriodStart.toISOString()}_${periodEnd.toISOString()}`,
        periodStart: currentPeriodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        measurementCount: periodMeasurements.length,
        containers: [...new Set(periodMeasurements.map(m => m.containerId))],
        statistics: stats,
        measurements: periodMeasurements, // Include raw data for PDF generation
        timeRange: formatPeriodTimeRange(currentPeriodStart, periodEnd)
      });
    }
    
    currentPeriodStart = new Date(periodEnd);
  }
  
  return periods.reverse(); // Return newest first
};

// Calculate statistics for a period
const calculatePeriodStatistics = (measurements) => {
  const stats = {
    temperature: {
      avg: calculateAverage(measurements, 'temperature'),
      min: Math.min(...measurements.map(m => m.temperature)),
      max: Math.max(...measurements.map(m => m.temperature))
    },
    pH: {
      avg: calculateAverage(measurements, 'pH'),
      min: Math.min(...measurements.map(m => m.pH)),
      max: Math.max(...measurements.map(m => m.pH))
    },
    weight: {
      avg: calculateAverage(measurements, 'weight'),
      min: Math.min(...measurements.map(m => m.weight)),
      max: Math.max(...measurements.map(m => m.weight))
    },
    volume: {
      avg: calculateAverage(measurements, 'volume'),
      min: Math.min(...measurements.map(m => m.volume)),
      max: Math.max(...measurements.map(m => m.volume))
    },
    qualityScore: {
      avg: calculateAverage(measurements, 'qualityScore'),
      min: Math.min(...measurements.map(m => m.qualityScore)),
      max: Math.max(...measurements.map(m => m.qualityScore))
    }
  };
  
  // Add quality assessment
  stats.overallQuality = stats.qualityScore.avg >= 80 ? 'Good' : 
                        stats.qualityScore.avg >= 60 ? 'Average' : 'Poor';
  
  return stats;
};

// Format period time range for display
const formatPeriodTimeRange = (start, end) => {
  const startStr = start.toLocaleDateString() + ' ' + start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endStr = end.toLocaleDateString() + ' ' + end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (start.toDateString() === end.toDateString()) {
    // Same day
    return {
      date: start.toLocaleDateString(),
      timeRange: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
  } else {
    // Different days
    return {
      date: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      timeRange: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
  }
};

// Generate PDF buffer for a period
const generatePeriodPDFBuffer = async (measurements, periodStart, periodEnd) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // PDF Header
      doc.fontSize(20).text('Milk Quality Monitoring Report', { align: 'center' });
      doc.moveDown();
      
      // Period information
      const startDate = new Date(periodStart);
      const endDate = new Date(periodEnd);
      doc.fontSize(14).text(`Report Period: ${startDate.toLocaleString()} - ${endDate.toLocaleString()}`);
      doc.text(`Total Measurements: ${measurements.length}`);
      doc.moveDown();
      
      if (measurements.length > 0) {
        // Statistics
        const stats = calculatePeriodStatistics(measurements);
        
        doc.fontSize(16).text('Summary Statistics', { underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(12);
        doc.text(`Temperature: Avg ${stats.temperature.avg}°C (${stats.temperature.min}°C - ${stats.temperature.max}°C)`);
        doc.text(`pH Level: Avg ${stats.pH.avg} (${stats.pH.min} - ${stats.pH.max})`);
        doc.text(`Weight: Avg ${stats.weight.avg}kg (${stats.weight.min}kg - ${stats.weight.max}kg)`);
        doc.text(`Volume: Avg ${stats.volume.avg}L (${stats.volume.min}L - ${stats.volume.max}L)`);
        doc.text(`Quality Score: Avg ${stats.qualityScore.avg} (${stats.qualityScore.min} - ${stats.qualityScore.max})`);
        doc.text(`Overall Quality: ${stats.overallQuality}`);
        
        doc.moveDown();
        
        // Detailed measurements table
        doc.fontSize(16).text('Detailed Measurements', { underline: true });
        doc.moveDown(0.5);
        
        // Table headers
        doc.fontSize(10);
        const tableTop = doc.y;
        const col1 = 50, col2 = 150, col3 = 220, col4 = 270, col5 = 320, col6 = 370, col7 = 420;
        
        doc.text('Time', col1, tableTop);
        doc.text('Container', col2, tableTop);
        doc.text('Temp(°C)', col3, tableTop);
        doc.text('pH', col4, tableTop);
        doc.text('Weight(kg)', col5, tableTop);
        doc.text('Volume(L)', col6, tableTop);
        doc.text('Quality', col7, tableTop);
        
        // Draw line under headers
        doc.moveTo(col1, tableTop + 15).lineTo(col7 + 50, tableTop + 15).stroke();
        
        let currentY = tableTop + 25;
        
        measurements.forEach((measurement, index) => {
          if (currentY > 700) { // Start new page
            doc.addPage();
            currentY = 50;
          }
          
          const time = new Date(measurement.timestamp).toLocaleTimeString();
          doc.text(time, col1, currentY);
          doc.text(measurement.containerId, col2, currentY);
          doc.text(measurement.temperature.toString(), col3, currentY);
          doc.text(measurement.pH.toString(), col4, currentY);
          doc.text(measurement.weight.toString(), col5, currentY);
          doc.text(measurement.volume.toString(), col6, currentY);
          doc.text(measurement.qualityScore.toString(), col7, currentY);
          
          currentY += 20;
        });
      }
      
      // Footer
      doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, 50, doc.page.height - 50);
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

////////////////////////////////////////////// Get measurements grouped by periods (12h) ////////////////////////////////////////////
export const getPeriodSummaries = async (req, res) => {
  try {
    console.log('🔄 getPeriodSummaries called with query:', req.query);
    
    const { containerId, days = 7, periodHours = 12 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    console.log('📅 Date range:', { startDate, days: parseInt(days) });
    
    // Build query
    let query = { timestamp: { $gte: startDate } };
    if (containerId && containerId !== 'all') {
      query.containerId = containerId;
      console.log('🏷️ Filtering by container:', containerId);
    }
    
    console.log('🔍 MongoDB query:', JSON.stringify(query, null, 2));
    
    // Check if Measurement model is available
    if (!Measurement) {
      throw new Error('Measurement model not found');
    }
    
    const measurements = await Measurement.find(query).sort({ timestamp: 1 });
    console.log('📊 Found measurements:', measurements.length);
    
    if (measurements.length === 0) {
      console.log('⚠️ No measurements found');
      return res.json({
        success: true,
        data: [],
        periodHours: parseInt(periodHours),
        totalPeriods: 0,
        message: 'No measurements found for the specified period'
      });
    }
    
    // Group measurements by periods
    const periodSummaries = groupMeasurementsByPeriod(measurements, parseInt(periodHours));
    console.log('📈 Generated period summaries:', periodSummaries.length);
    
    res.json({
      success: true,
      data: periodSummaries,
      periodHours: parseInt(periodHours),
      totalPeriods: periodSummaries.length,
      totalMeasurements: measurements.length,
      dateRange: {
        start: startDate,
        end: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Error fetching period summaries:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


////////////////////////////////////////////// Generate PDF report for a period ////////////////////////////////////////////
export const generatePeriodPDF = async (req, res) => {
  try {
    const { periodStart, periodEnd, containerId } = req.query;
    
    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        error: 'Period start and end dates are required'
      });
    }
    
    // Build query for the specific period
    let query = {
      timestamp: {
        $gte: new Date(periodStart),
        $lte: new Date(periodEnd)
      }
    };
    
    if (containerId && containerId !== 'all') {
      query.containerId = containerId;
    }
    
    const measurements = await Measurement.find(query).sort({ timestamp: 1 });
    
    if (measurements.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No measurements found for this period'
      });
    }
    
    // Generate PDF
    const pdfBuffer = await generatePeriodPDFBuffer(measurements, periodStart, periodEnd);
    
    // Set response headers
    const filename = `report_${new Date(periodStart).toISOString().split('T')[0]}_${new Date(periodStart).getHours()}h.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Delete measurements in a period ////////////////////////////////////////////
export const deletePeriodMeasurements = async (req, res) => {
  try {
    const { periodStart, periodEnd, containerId } = req.body;
    
    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        error: 'Period start and end dates are required'
      });
    }
    
    // Build query for the specific period
    let query = {
      timestamp: {
        $gte: new Date(periodStart),
        $lte: new Date(periodEnd)
      }
    };
    
    if (containerId && containerId !== 'all') {
      query.containerId = containerId;
    }
    
    const result = await Measurement.deleteMany(query);
    
    console.log(`🗑️ Deleted ${result.deletedCount} measurements from period ${periodStart} to ${periodEnd}`);
    
    res.json({
      success: true,
      message: `${result.deletedCount} measurements deleted from the selected period`,
      deletedCount: result.deletedCount,
      period: { start: periodStart, end: periodEnd }
    });
    
  } catch (error) {
    console.error('Error deleting period measurements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};




////////////////////////////////////////////// Get measurements with filtering and pagination ////////////////////////////////////////////
export const getFilteredMeasurements = async (req, res) => {
  try {
    const { 
      containerId, 
      startDate, 
      endDate, 
      sortBy = 'timestamp', 
      order = 'desc',
      limit = 100,
      offset = 0,
      qualityThreshold 
    } = req.query;

    // Build query object
    let query = {};
    
    // Container filter
    if (containerId && containerId !== 'all') {
      query.containerId = containerId;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Quality score filter
    if (qualityThreshold) {
      query.qualityScore = { $gte: parseInt(qualityThreshold) };
    }

    const measurements = await Measurement.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Get total count for pagination
    const totalCount = await Measurement.countDocuments(query);

    res.json({
      success: true,
      data: measurements,
      pagination: {
        total: totalCount,
        count: measurements.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: totalCount > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching filtered measurements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Get historical statistics ////////////////////////////////////////////
export const getHistoricalStatistics = async (req, res) => {
  try {
    const { days = 30, containerId } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Build query
    let query = { timestamp: { $gte: startDate } };
    if (containerId && containerId !== 'all') {
      query.containerId = containerId;
    }
    
    const measurements = await Measurement.find(query);
    
    if (measurements.length === 0) {
      return res.json({
        success: true,
        data: {
          totalMeasurements: 0,
          averageTemperature: 0,
          averagePh: 0,
          averageWeight: 0,
          averageVolume: 0,
          averageQualityScore: 0,
          temperatureRange: { min: 0, max: 0 },
          phRange: { min: 0, max: 0 },
          qualityDistribution: { good: 0, average: 0, poor: 0 },
          containerBreakdown: {}
        }
      });
    }
    
    // Calculate ranges
    const temperatures = measurements.map(m => m.temperature);
    const pHs = measurements.map(m => m.pH);
    const qualityScores = measurements.map(m => m.qualityScore);
    
    // Quality distribution
    const qualityDistribution = {
      good: qualityScores.filter(score => score >= 80).length,
      average: qualityScores.filter(score => score >= 60 && score < 80).length,
      poor: qualityScores.filter(score => score < 60).length
    };
    
    // Container breakdown
    const containerBreakdown = {};
    measurements.forEach(m => {
      if (!containerBreakdown[m.containerId]) {
        containerBreakdown[m.containerId] = {
          name: m.containerName,
          count: 0,
          averageQuality: 0
        };
      }
      containerBreakdown[m.containerId].count++;
    });
    
    // Calculate average quality per container
    Object.keys(containerBreakdown).forEach(containerId => {
      const containerMeasurements = measurements.filter(m => m.containerId === containerId);
      containerBreakdown[containerId].averageQuality = calculateAverage(containerMeasurements, 'qualityScore');
    });
    
    const statistics = {
      totalMeasurements: measurements.length,
      averageTemperature: calculateAverage(measurements, 'temperature'),
      averagePh: calculateAverage(measurements, 'pH'),
      averageWeight: calculateAverage(measurements, 'weight'),
      averageVolume: calculateAverage(measurements, 'volume'),
      averageQualityScore: calculateAverage(measurements, 'qualityScore'),
      temperatureRange: {
        min: Math.min(...temperatures),
        max: Math.max(...temperatures)
      },
      phRange: {
        min: Math.min(...pHs),
        max: Math.max(...pHs)
      },
      qualityDistribution,
      containerBreakdown,
      dateRange: {
        start: startDate,
        end: new Date()
      }
    };
    
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching historical statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Delete single measurement ////////////////////////////////////////////
export const deleteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedMeasurement = await Measurement.findByIdAndDelete(id);
    
    if (!deletedMeasurement) {
      return res.status(404).json({
        success: false,
        error: 'Measurement not found'
      });
    }
    
    console.log(`🗑️ Deleted measurement: ${id}`);
    
    res.json({
      success: true,
      message: 'Measurement deleted successfully',
      data: deletedMeasurement
    });
  } catch (error) {
    console.error('Error deleting measurement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Delete multiple measurements ////////////////////////////////////////////
export const deleteMultipleMeasurements = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid measurement IDs provided'
      });
    }
    
    const result = await Measurement.deleteMany({
      _id: { $in: ids }
    });
    
    console.log(`🗑️ Deleted ${result.deletedCount} measurements`);
    
    res.json({
      success: true,
      message: `${result.deletedCount} measurements deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting multiple measurements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Clear all data ////////////////////////////////////////////
export const clearAllMeasurements = async (req, res) => {
  try {
    const { containerId } = req.query;
    
    let query = {};
    if (containerId && containerId !== 'all') {
      query.containerId = containerId;
    }
    
    const result = await Measurement.deleteMany(query);
    
    console.log(`🗑️ Cleared ${result.deletedCount} measurements${containerId ? ` for container ${containerId}` : ''}`);
    
    res.json({
      success: true,
      message: containerId 
        ? `All measurements for ${containerId} cleared successfully` 
        : 'All measurements cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing measurements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Export measurements (CSV format) ////////////////////////////////////////////
export const exportMeasurements = async (req, res) => {
  try {
    const { 
      containerId, 
      startDate, 
      endDate, 
      format = 'csv',
      ids // for exporting specific measurements
    } = req.query;
    
    let query = {};
    
    // If specific IDs are provided, use those
    if (ids) {
      const idArray = ids.split(',');
      query._id = { $in: idArray };
    } else {
      // Otherwise use filters
      if (containerId && containerId !== 'all') {
        query.containerId = containerId;
      }
      
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }
    }
    
    const measurements = await Measurement.find(query).sort({ timestamp: -1 });
    
    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Container ID,Container Name,Temperature (°C),pH,Weight (kg),Volume (L),Quality Score,Timestamp\n';
      const csvData = measurements.map(m => 
        `${m.containerId},${m.containerName},${m.temperature},${m.pH},${m.weight},${m.volume},${m.qualityScore},${m.timestamp.toISOString()}`
      ).join('\n');
      
      const csvContent = csvHeader + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="measurements_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: measurements,
        count: measurements.length,
        exportedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error exporting measurements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

////////////////////////////////////////////// Get containers list ////////////////////////////////////////////
export const getContainers = async (req, res) => {
  try {
    const containers = await Measurement.aggregate([
      {
        $group: {
          _id: '$containerId',
          name: { $first: '$containerName' },
          measurementCount: { $sum: 1 },
          lastMeasurement: { $max: '$timestamp' },
          averageQualityScore: { $avg: '$qualityScore' }
        }
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          measurementCount: 1,
          lastMeasurement: 1,
          averageQualityScore: { $round: ['$averageQualityScore', 2] }
        }
      },
      {
        $sort: { lastMeasurement: -1 }
      }
    ]);
    
    res.json({
      success: true,
      data: containers
    });
  } catch (error) {
    console.error('Error fetching containers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



import Detection from '../models/Detection.js';


/**
 * Get all statistics for dashboard stat boxes
 * @route GET /api/detections/stats-box
 */
export const getStatBox = async (req, res) => {
  try {
    // Get start and end of today for today's detections
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Execute all queries in parallel for better performance
    const [
      totalCount,
      averageConfidenceResult,
      mostDetectedResult,
      todayCount,
      todayBreakdown
    ] = await Promise.all([
      // Total detections
      Detection.countDocuments(),
      
      // Average confidence
      Detection.aggregate([
        {
          $group: {
            _id: null,
            averageConfidence: { $avg: '$confidence' },
            totalDetections: { $sum: 1 }
          }
        }
      ]),
      
      // Most detected animal
      Detection.aggregate([
        {
          $group: {
            _id: '$class_name',
            count: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 1
        }
      ]),
      
      // Today's total count
      Detection.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }),
      
      // Today's breakdown by species
      Detection.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          }
        },
        {
          $group: {
            _id: '$class_name',
            count: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ])
    ]);

    // Process average confidence data
    const avgConfidenceData = averageConfidenceResult.length > 0 
      ? {
          averageConfidence: parseFloat(averageConfidenceResult[0].averageConfidence.toFixed(4)),
          totalDetections: averageConfidenceResult[0].totalDetections
        }
      : {
          averageConfidence: 0,
          totalDetections: 0
        };

    // Process most detected animal data
    const mostDetectedData = mostDetectedResult.length > 0
      ? {
          mostDetectedAnimal: mostDetectedResult[0]._id,
          detectionCount: mostDetectedResult[0].count,
          averageConfidence: parseFloat(mostDetectedResult[0].avgConfidence.toFixed(4))
        }
      : {
          mostDetectedAnimal: null,
          detectionCount: 0,
          averageConfidence: 0
        };

    // Process today's breakdown data
    const todayBreakdownData = todayBreakdown.map(animal => ({
      species: animal._id,
      count: animal.count,
      averageConfidence: parseFloat(animal.avgConfidence.toFixed(4))
    }));

    // Combine all data
    const statBoxData = {
      totalDetections: {
        count: totalCount,
        message: `Total detections: ${totalCount}`
      },
      averageConfidence: {
        ...avgConfidenceData,
        message: avgConfidenceData.totalDetections > 0 
          ? `Average confidence: ${avgConfidenceData.averageConfidence} across ${avgConfidenceData.totalDetections} detections`
          : 'No detections found'
      },
      mostDetectedAnimal: {
        ...mostDetectedData,
        message: mostDetectedData.mostDetectedAnimal 
          ? `Most detected: ${mostDetectedData.mostDetectedAnimal} (${mostDetectedData.detectionCount} detections)`
          : 'No detections found'
      },
      todayDetections: {
        date: today.toDateString(),
        totalDetectionsToday: todayCount,
        animalBreakdown: todayBreakdownData,
        message: `Today's detections: ${todayCount}`
      }
    };

    res.status(200).json({
      success: true,
      data: statBoxData,
      message: 'Statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching stat box data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};


/**
 * Get overview of detections by month for chart visualization
 * @route GET /api/detections/overview
 */
export const getOverview = async (req, res) => {
  try {    // Get detections grouped by month
    const monthlyDetections = await Detection.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalDetections: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalDetections: 1
        }
      },
      {
        $limit: 12 // Last 12 months
      }
    ]);

    // Format data for chart consumption
    const formattedData = monthlyDetections.map(item => {
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];      return {
        month: `${monthNames[item.month - 1]} ${item.year}`,
        totalDetections: item.totalDetections,
        monthNumber: item.month,
        year: item.year
      };
    });    // Get total summary
    const totalDetections = await Detection.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        monthlyData: formattedData,
        summary: {
          totalDetections: totalDetections,
          monthsIncluded: formattedData.length
        }
      },
      message: `Overview data retrieved for ${formattedData.length} months`
    });
  } catch (error) {
    console.error('Error fetching overview data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview data',
      error: error.message
    });
  }
};


/**
 * Get breakdown of animals vs total times detected
 * @route GET /api/detections/breakdown
 */
export const getBreakdown = async (req, res) => {
  try {    // Get breakdown by animal species
    const animalBreakdown = await Detection.aggregate([
      {
        $group: {
          _id: '$class_name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $project: {
          _id: 0,
          animal: '$_id',
          totalDetections: '$count'
        }
      }
    ]);

    // Calculate total detections for percentage calculation
    const totalDetections = animalBreakdown.reduce((sum, animal) => sum + animal.totalDetections, 0);

    // Add percentage to each animal
    const formattedBreakdown = animalBreakdown.map(animal => ({
      ...animal,
      percentage: totalDetections > 0 ? parseFloat(((animal.totalDetections / totalDetections) * 100).toFixed(2)) : 0
    }));    res.status(200).json({
      success: true,
      data: formattedBreakdown,
      message: `Breakdown retrieved for ${formattedBreakdown.length} animal species`
    });
  } catch (error) {
    console.error('Error fetching breakdown data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch breakdown data',
      error: error.message
    });
  }
};


/**
 * Get all detection data with basic fields
 * @route GET /api/detections/data
 */
export const getData = async (req, res) => {
  try {
    // Fetch all detections with only the specified fields
    const detections = await Detection.find({}, {
      detection_id: 1,
      formatted_time: 1,
      class_name: 1,
      confidence: 1,
      _id: 0 // Exclude the MongoDB _id field
    }).sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      count: detections.length,
      data: detections,
      message: `Retrieved ${detections.length} detection records`
    });
  } catch (error) {
    console.error('Error fetching detection data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch detection data',
      error: error.message
    });
  }
};


/**
 * Get paginated detection list with sorting and search
 * @route GET /api/detections/list
 */
export const getDetectionList = async (req, res) => {
  try {
    // sort should look like this: { "field": "createdAt", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { createdAt: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort === "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : { createdAt: -1 }; // Default sort by newest first

    const detections = await Detection.find({
      $or: [
        { detection_id: { $regex: new RegExp(search, "i") } },
        { class_name: { $regex: new RegExp(search, "i") } },
        { formatted_time: { $regex: new RegExp(search, "i") } },
      ],
    }, {
      detection_id: 1,
      formatted_time: 1,
      class_name: 1,
      confidence: 1,
      createdAt: 1,
      _id: 0 // Exclude the MongoDB _id field
    })
      .sort(sortFormatted)
      .skip((page - 1) * pageSize) // Fix: should be (page - 1) * pageSize
      .limit(parseInt(pageSize));

    const total = await Detection.countDocuments({
      $or: [
        { detection_id: { $regex: new RegExp(search, "i") } },
        { class_name: { $regex: new RegExp(search, "i") } },
        { formatted_time: { $regex: new RegExp(search, "i") } },
      ],
    });

    res.status(200).json({
      success: true,
      detections,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize),
      message: `Retrieved ${detections.length} detections (page ${page} of ${Math.ceil(total / pageSize)})`
    });
  } catch (error) {
    console.error('Error fetching detection list:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch detection list',
      error: error.message 
    });
  }
};
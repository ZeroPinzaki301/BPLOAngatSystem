import Business from "../models/businessForm.model.js";

export const getBusinessesWithFilters = async (req, res) => {
  try {
    const {
      search,
      year,
      status,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { firstname: searchRegex },
        { middlename: searchRegex },
        { lastname: searchRegex },
        { businessName: searchRegex },
        { address: searchRegex },
        { controlNumber: searchRegex }
      ];
    }

    if (year) {
      filter.controlNumber = { $regex: `^${year}-` };
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const businesses = await Business.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select("-__v");

    const total = await Business.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: businesses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error in getBusinessesWithFilters:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getBusinessesByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const { status } = req.query;

    const filter = {
      controlNumber: { $regex: `^${year}-` }
    };

    if (status) {
      filter.status = status;
    }

    const businesses = await Business.find(filter)
      .sort({ controlNumber: 1 })
      .select("-__v");

    const total = businesses.length;
    const statusCounts = businesses.reduce((acc, business) => {
      acc[business.status] = (acc[business.status] || 0) + 1;
      return acc;
    }, {});

    const monthlyData = businesses.reduce((acc, business) => {
      const month = business.createdAt.getMonth() + 1; // 1-12
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      year,
      data: businesses,
      statistics: {
        total,
        statusCounts,
        monthlyData
      }
    });
  } catch (error) {
    console.error("Error in getBusinessesByYear:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getBusinessByControlNumber = async (req, res) => {
  try {
    const { controlNumber } = req.params;

    const business = await Business.findOne({ controlNumber }).select("-__v");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error("Error in getBusinessByControlNumber:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const searchBusinessesByName = async (req, res) => {
  try {
    const { name, exactMatch = false } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name parameter is required"
      });
    }

    let filter;
    if (exactMatch === "true") {
      filter = {
        $or: [
          { firstname: name },
          { middlename: name },
          { lastname: name },
          { businessName: name }
        ]
      };
    } else {
      const nameRegex = new RegExp(name, "i");
      filter = {
        $or: [
          { firstname: nameRegex },
          { middlename: nameRegex },
          { lastname: nameRegex },
          { businessName: nameRegex }
        ]
      };
    }

    const businesses = await Business.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    console.error("Error in searchBusinessesByName:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const searchBusinessesByAddress = async (req, res) => {
  try {
    const { address, exactMatch = false } = req.query;

    if (!address || address.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Address parameter is required"
      });
    }

    let filter;
    if (exactMatch === "true") {
      filter = { address };
    } else {
      const addressRegex = new RegExp(address, "i");
      filter = { address: addressRegex };
    }

    const businesses = await Business.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    console.error("Error in searchBusinessesByAddress:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getDashboardStatistics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const totalBusinesses = await Business.countDocuments();
    const currentYearBusinesses = await Business.countDocuments({
      controlNumber: { $regex: `^${currentYear}-` }
    });

    const statusStats = await Business.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const yearlyStats = await Business.aggregate([
      {
        $project: {
          year: { $substr: ["$controlNumber", 0, 4] }
        }
      },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    const recentBusinesses = await Business.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstname lastname businessName controlNumber createdAt status");

    res.status(200).json({
      success: true,
      data: {
        totalBusinesses,
        currentYearBusinesses,
        statusDistribution: statusStats,
        yearlyDistribution: yearlyStats,
        recentBusinesses
      }
    });
  } catch (error) {
    console.error("Error in getDashboardStatistics:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
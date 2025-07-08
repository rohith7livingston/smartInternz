const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  // In a real app, user ID would come from a protected route middleware
  const { userId, title, description } = req.body; 
  try {
    const complaint = await Complaint.create({ user: userId, title, description });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get complaints for a specific user
// @route   GET /api/complaints/my/:userId
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.params.userId }).populate('assignedTo', 'name');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all complaints (Admin/Agent)
// @route   GET /api/complaints
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).populate('user', 'name email').populate('assignedTo', 'name');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update complaint status or assign agent (Admin)
// @route   PUT /api/complaints/:id
exports.updateComplaint = async (req, res) => {
    const { status, assignedTo } = req.body;
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        complaint.status = status || complaint.status;
        complaint.assignedTo = assignedTo || complaint.assignedTo;
        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/healthcare_app')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ========== SCHEMAS ==========

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'provider', 'admin'], default: 'patient' },
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  bloodGroup: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalHistory: [String],
  allergies: [String],
  profileImage: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

// Doctor Schema (Extended)
const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  specialty: String,
  qualification: String,
  experience: Number,
  consultationFee: Number,
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  availability: [{
    day: String,
    slots: [{ start: String, end: String, isAvailable: Boolean }]
  }],
  about: String,
  profileImage: String,
  isAvailable: { type: Boolean, default: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: String,
  doctorSpecialty: String,
  doctorImage: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['consultation', 'follow-up', 'emergency', 'checkup', 'vaccination'], default: 'consultation' },
  symptoms: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled'], default: 'pending' },
  notes: String,
  prescription: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Medical Record Schema
const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: String,
  diagnosis: String,
  symptoms: String,
  treatment: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    bloodSugar: Number,
    cholesterol: Number
  },
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    date: Date,
    fileUrl: String
  }],
  followUpDate: Date,
  notes: String,
  date: { type: Date, default: Date.now }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
    quantity: Number
  }],
  notes: String,
  refillCount: { type: Number, default: 0 },
  validUntil: Date,
  createdAt: { type: Date, default: Date.now }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

// Invoice/Billing Schema
const invoiceSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  amount: Number,
  tax: Number,
  total: Number,
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  paymentMethod: String,
  transactionId: String,
  date: { type: Date, default: Date.now }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  type: { type: String, enum: ['appointment', 'prescription', 'payment', 'reminder', 'alert'] },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// ========== MIDDLEWARE ==========
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// ========== API ROUTES ==========

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, dateOfBirth, gender } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password, role, phone, dateOfBirth, gender });
    await user.save();
    
    // If role is provider, create doctor profile
    if (role === 'provider') {
      const doctor = new Doctor({
        userId: user._id,
        name: user.name,
        email: user.email,
        specialty: 'General Physician',
        qualification: 'MBBS',
        experience: 0,
        consultationFee: 500,
        isAvailable: true
      });
      await doctor.save();
    }
    
    const token = jwt.sign({ id: user._id }, 'secret_key');
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, 'secret_key');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  res.json(req.user);
});

// Doctor Routes
app.get('/api/doctors', auth, async (req, res) => {
  try {
    const { specialty, search } = req.query;
    let query = { isAvailable: true };
    if (specialty && specialty !== 'all') query.specialty = specialty;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } }
      ];
    }
    const doctors = await Doctor.find(query).limit(20);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/doctors/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    const reviews = await Review.find({ doctorId: req.params.id }).sort({ date: -1 });
    res.json({ doctor, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/doctors/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      doctorId: req.params.id,
      patientId: req.user._id,
      patientName: req.user.name,
      rating,
      comment
    });
    await review.save();
    
    // Update doctor rating
    const reviews = await Review.find({ doctorId: req.params.id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Doctor.findByIdAndUpdate(req.params.id, { 
      rating: avgRating, 
      totalReviews: reviews.length 
    });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Appointment Routes
app.post('/api/appointments', auth, async (req, res) => {
  try {
    const { doctorId, date, time, type, symptoms } = req.body;
    const doctor = await Doctor.findById(doctorId);
    const appointment = new Appointment({
      patientId: req.user._id,
      patientName: req.user.name,
      patientEmail: req.user.email,
      patientPhone: req.user.phone,
      doctorId,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.profileImage,
      date,
      time,
      type,
      symptoms,
      status: 'pending',
      amount: doctor.consultationFee,
      paymentStatus: 'pending'
    });
    await appointment.save();
    
    // Create notification
    const notification = new Notification({
      userId: req.user._id,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.name} on ${new Date(date).toLocaleDateString()} at ${time} has been booked successfully.`,
      type: 'appointment'
    });
    await notification.save();
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/appointments', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'provider') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) query.doctorId = doctor._id;
    }
    
    if (status) query.status = status;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const appointments = await Appointment.find(query).sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/appointments/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    
    const notification = new Notification({
      userId: appointment.patientId,
      title: `Appointment ${status}`,
      message: `Your appointment with Dr. ${appointment.doctorName} on ${new Date(appointment.date).toLocaleDateString()} has been ${status}.`,
      type: 'appointment'
    });
    await notification.save();
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/appointments/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment.status === 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel confirmed appointment' });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Medical Records Routes
app.post('/api/medical-records', auth, async (req, res) => {
  try {
    const record = new MedicalRecord({ ...req.body, patientId: req.user._id, patientName: req.user.name });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/medical-records', auth, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/medical-records/:id', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (record.patientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Prescription Routes
app.post('/api/prescriptions', auth, async (req, res) => {
  try {
    const prescription = new Prescription({ ...req.body, doctorId: req.user._id, doctorName: req.user.name });
    await prescription.save();
    
    const notification = new Notification({
      userId: prescription.patientId,
      title: 'New Prescription',
      message: `Dr. ${req.user.name} has issued a new prescription for you.`,
      type: 'prescription'
    });
    await notification.save();
    
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/prescriptions', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user._id }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Invoice Routes
app.post('/api/invoices', auth, async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;
    const tax = amount * 0.18;
    const total = amount + tax;
    const invoice = new Invoice({
      patientId: req.user._id,
      appointmentId,
      amount,
      tax,
      total,
      status: 'pending'
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/invoices', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ patientId: req.user._id }).sort({ date: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Notification Routes
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stats Dashboard
app.get('/api/stats', auth, async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ patientId: req.user._id });
    const upcomingAppointments = await Appointment.countDocuments({ 
      patientId: req.user._id, 
      date: { $gte: new Date() },
      status: 'confirmed'
    });
    const completedAppointments = await Appointment.countDocuments({ patientId: req.user._id, status: 'completed' });
    const prescriptions = await Prescription.countDocuments({ patientId: req.user._id });
    const medicalRecords = await MedicalRecord.countDocuments({ patientId: req.user._id });
    const pendingPayments = await Invoice.countDocuments({ patientId: req.user._id, status: 'pending' });
    
    // Recent activity
    const recentAppointments = await Appointment.find({ patientId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);
    const recentPrescriptions = await Prescription.find({ patientId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);
    
    res.json({
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      prescriptions,
      medicalRecords,
      pendingPayments,
      recentAppointments,
      recentPrescriptions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Stats
app.get('/api/admin/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalRevenue = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const recentAppointments = await Appointment.find().sort({ createdAt: -1 }).limit(10);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);
    
    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentAppointments,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
app.put('/api/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Available Time Slots
app.get('/api/doctors/:id/slots', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findById(req.params.id);
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const availability = doctor.availability.find(a => a.day === dayOfWeek);
    
    if (!availability) {
      return res.json([]);
    }
    
    // Get booked appointments for that day
    const bookedAppointments = await Appointment.find({
      doctorId: req.params.id,
      date: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
    });
    
    const bookedSlots = bookedAppointments.map(a => a.time);
    const availableSlots = availability.slots
      .filter(slot => slot.isAvailable && !bookedSlots.includes(slot.start))
      .map(slot => slot.start);
    
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Initialize sample doctors if none exist
const initializeDoctors = async () => {
  const doctorCount = await Doctor.countDocuments();
  if (doctorCount === 0) {
    const sampleDoctors = [
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        qualification: 'MD, FACC',
        experience: 12,
        consultationFee: 1500,
        rating: 4.8,
        about: 'Expert in cardiovascular diseases with 12+ years of experience.',
        availability: [
          { day: 'Monday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] },
          { day: 'Wednesday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] },
          { day: 'Friday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] }
        ]
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Neurologist',
        qualification: 'MD, PhD',
        experience: 15,
        consultationFee: 1800,
        rating: 4.9,
        about: 'Specialized in neurological disorders and brain health.',
        availability: [
          { day: 'Tuesday', slots: [{ start: '10:00', end: '18:00', isAvailable: true }] },
          { day: 'Thursday', slots: [{ start: '10:00', end: '18:00', isAvailable: true }] }
        ]
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrician',
        qualification: 'MD, FAAP',
        experience: 8,
        consultationFee: 1200,
        rating: 4.7,
        about: 'Caring for children from newborns to adolescents.',
        availability: [
          { day: 'Monday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] },
          { day: 'Tuesday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] },
          { day: 'Thursday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] }
        ]
      },
      {
        name: 'Dr. James Wilson',
        specialty: 'Orthopedic',
        qualification: 'MS Ortho',
        experience: 10,
        consultationFee: 1400,
        rating: 4.6,
        about: 'Expert in bone and joint surgeries.',
        availability: [
          { day: 'Wednesday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] },
          { day: 'Friday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] }
        ]
      },
      {
        name: 'Dr. Lisa Patel',
        specialty: 'Dermatologist',
        qualification: 'MD Dermatology',
        experience: 7,
        consultationFee: 1300,
        rating: 4.8,
        about: 'Skin care specialist and cosmetic dermatology.',
        availability: [
          { day: 'Monday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] },
          { day: 'Wednesday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] },
          { day: 'Friday', slots: [{ start: '09:00', end: '17:00', isAvailable: true }] }
        ]
      }
    ];
    await Doctor.insertMany(sampleDoctors);
    console.log('✅ Sample doctors initialized');
  }
};

initializeDoctors();
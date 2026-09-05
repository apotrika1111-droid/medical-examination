const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password — change this to something secret!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'الاسم ورقم الهاتف مطلوبان.' });
  }
  try {
    const existing = await db.findVisitorByPhone(phone);
    if (existing) {
      return res.status(409).json({ success: false, error: 'رقم الهاتف مسجل بالفعل! رقمك هو ' + existing.id });
    }
    const id = await db.addVisitor(name, phone);
    return res.json({ success: true, number: id });
  } catch (err) {
    console.error('Error in /register:', err);
    return res.status(500).json({ success: false, error: 'خطأ في الخادم.' });
  }
});

// Admin login endpoint
app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة.' });
});

// Get all visitors (admin)
app.post('/admin/visitors', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'غير مصرح.' });
  }
  try {
    const visitors = await db.getAllVisitors();
    const count = await db.getVisitorCount();
    return res.json({ success: true, visitors, count });
  } catch (err) {
    console.error('Error in /admin/visitors:', err);
    return res.status(500).json({ success: false, error: 'خطأ في الخادم.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

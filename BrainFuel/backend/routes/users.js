import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, name, department, university, bio } = req.body;
        
        // Check if user already exists
        const existingUser = await db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const result = await db.run(`
            INSERT INTO users (username, email, password_hash, name, department, university, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [username, email, hashedPassword, name, department, university, bio]);
        
        // Generate JWT token
        const token = jwt.sign({ userId: result.lastID }, JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.lastID,
                username,
                email,
                name,
                department,
                university
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                department: user.department,
                university: user.university,
                avatar_url: user.avatar_url
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.get('SELECT id, username, email, name, avatar_url, department, university, bio, created_at FROM users WHERE id = ?', [decoded.userId]);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const { name, department, university, bio, avatar_url } = req.body;
        
        const updates = [];
        const params = [];
        
        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (department) {
            updates.push('department = ?');
            params.push(department);
        }
        if (university) {
            updates.push('university = ?');
            params.push(university);
        }
        if (bio) {
            updates.push('bio = ?');
            params.push(bio);
        }
        if (avatar_url) {
            updates.push('avatar_url = ?');
            params.push(avatar_url);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(decoded.userId);
        
        await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
        
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's projects
router.get('/projects', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const sql = `
            SELECT 
                p.*,
                c.name as category_name,
                GROUP_CONCAT(pt.tag_name) as tags
            FROM projects p
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN project_tags pt ON p.id = pt.project_id
            WHERE p.author_id = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
        
        const projects = await db.all(sql, [decoded.userId]);
        
        const projectsWithTags = projects.map(project => ({
            ...project,
            tags: project.tags ? project.tags.split(',') : []
        }));
        
        res.json(projectsWithTags);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's supported projects
router.get('/supported', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const sql = `
            SELECT 
                p.*,
                c.name as category_name,
                u.name as author_name,
                u.avatar_url as author_avatar,
                u.department as author_department,
                GROUP_CONCAT(pt.tag_name) as tags
            FROM project_support ps
            JOIN projects p ON ps.project_id = p.id
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.author_id = u.id
            LEFT JOIN project_tags pt ON p.id = pt.project_id
            WHERE ps.user_id = ?
            GROUP BY p.id
            ORDER BY ps.created_at DESC
        `;
        
        const projects = await db.all(sql, [decoded.userId]);
        
        const projectsWithTags = projects.map(project => ({
            ...project,
            tags: project.tags ? project.tags.split(',') : []
        }));
        
        res.json(projectsWithTags);
    } catch (error) {
        console.error('Error fetching supported projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export default router; 
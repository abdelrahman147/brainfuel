import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Get all projects with optional filtering
router.get('/', async (req, res) => {
    try {
        const { category, search, limit = 20, offset = 0 } = req.query;
        
        let sql = `
            SELECT 
                p.*,
                c.name as category_name,
                u.name as author_name,
                u.avatar_url as author_avatar,
                u.department as author_department,
                GROUP_CONCAT(pt.tag_name) as tags
            FROM projects p
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.author_id = u.id
            LEFT JOIN project_tags pt ON p.id = pt.project_id
        `;
        
        const params = [];
        const conditions = [];
        
        if (category) {
            conditions.push('c.name = ?');
            params.push(category);
        }
        
        if (search) {
            conditions.push('(p.title LIKE ? OR p.description LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
        
        sql += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const projects = await db.all(sql, params);
        
        // Parse tags string into array
        const projectsWithTags = projects.map(project => ({
            ...project,
            tags: project.tags ? project.tags.split(',') : []
        }));
        
        res.json(projectsWithTags);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trending projects
router.get('/trending', async (req, res) => {
    try {
        const sql = `
            SELECT 
                p.*,
                c.name as category_name,
                u.name as author_name,
                u.avatar_url as author_avatar,
                u.department as author_department,
                GROUP_CONCAT(pt.tag_name) as tags
            FROM projects p
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.author_id = u.id
            LEFT JOIN project_tags pt ON p.id = pt.project_id
            GROUP BY p.id
            ORDER BY p.support_count DESC, p.views DESC
            LIMIT 5
        `;
        
        const projects = await db.all(sql);
        
        const projectsWithTags = projects.map(project => ({
            ...project,
            tags: project.tags ? project.tags.split(',') : []
        }));
        
        res.json(projectsWithTags);
    } catch (error) {
        console.error('Error fetching trending projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Increment view count
        await db.run('UPDATE projects SET views = views + 1 WHERE id = ?', [id]);
        
        const sql = `
            SELECT 
                p.*,
                c.name as category_name,
                u.name as author_name,
                u.avatar_url as author_avatar,
                u.department as author_department,
                GROUP_CONCAT(pt.tag_name) as tags
            FROM projects p
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.author_id = u.id
            LEFT JOIN project_tags pt ON p.id = pt.project_id
            WHERE p.id = ?
            GROUP BY p.id
        `;
        
        const project = await db.get(sql, [id]);
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        project.tags = project.tags ? project.tags.split(',') : [];
        
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new project
router.post('/', async (req, res) => {
    try {
        const { title, description, university, category, tags, imageUrl, authorId } = req.body;
        
        // Get category ID
        const categoryResult = await db.get('SELECT id FROM categories WHERE name = ?', [category]);
        if (!categoryResult) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        
        // Insert project
        const result = await db.run(`
            INSERT INTO projects (title, description, university, category_id, image_url, author_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [title, description, university, categoryResult.id, imageUrl, authorId]);
        
        const projectId = result.lastID;
        
        // Insert tags
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                await db.run('INSERT INTO project_tags (project_id, tag_name) VALUES (?, ?)', [projectId, tag]);
            }
        }
        
        res.status(201).json({ id: projectId, message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update project
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, university, category, tags, imageUrl, status } = req.body;
        
        // Get category ID if category is provided
        let categoryId = null;
        if (category) {
            const categoryResult = await db.get('SELECT id FROM categories WHERE name = ?', [category]);
            if (!categoryResult) {
                return res.status(400).json({ error: 'Invalid category' });
            }
            categoryId = categoryResult.id;
        }
        
        // Build update query
        const updates = [];
        const params = [];
        
        if (title) {
            updates.push('title = ?');
            params.push(title);
        }
        if (description) {
            updates.push('description = ?');
            params.push(description);
        }
        if (university) {
            updates.push('university = ?');
            params.push(university);
        }
        if (categoryId) {
            updates.push('category_id = ?');
            params.push(categoryId);
        }
        if (imageUrl) {
            updates.push('image_url = ?');
            params.push(imageUrl);
        }
        if (status) {
            updates.push('status = ?');
            params.push(status);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);
        
        await db.run(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`, params);
        
        // Update tags if provided
        if (tags) {
            // Remove existing tags
            await db.run('DELETE FROM project_tags WHERE project_id = ?', [id]);
            
            // Insert new tags
            for (const tag of tags) {
                await db.run('INSERT INTO project_tags (project_id, tag_name) VALUES (?, ?)', [id, tag]);
            }
        }
        
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete project
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.run('DELETE FROM projects WHERE id = ?', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Support/unsupport project
router.post('/:id/support', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        // Check if user already supports this project
        const existing = await db.get('SELECT id FROM project_support WHERE project_id = ? AND user_id = ?', [id, userId]);
        
        if (existing) {
            // Remove support
            await db.run('DELETE FROM project_support WHERE project_id = ? AND user_id = ?', [id, userId]);
            await db.run('UPDATE projects SET support_count = support_count - 1 WHERE id = ?', [id]);
            res.json({ supported: false, message: 'Support removed' });
        } else {
            // Add support
            await db.run('INSERT INTO project_support (project_id, user_id) VALUES (?, ?)', [id, userId]);
            await db.run('UPDATE projects SET support_count = support_count + 1 WHERE id = ?', [id]);
            res.json({ supported: true, message: 'Project supported' });
        }
    } catch (error) {
        console.error('Error updating project support:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 
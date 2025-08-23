import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await db.all('SELECT * FROM categories ORDER BY name');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get category with project count
router.get('/with-counts', async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.*,
                COUNT(p.id) as project_count
            FROM categories c
            LEFT JOIN projects p ON c.id = p.category_id
            GROUP BY c.id
            ORDER BY c.name
        `;
        
        const categories = await db.all(sql);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories with counts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await db.get('SELECT * FROM categories WHERE id = ?', [id]);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new category
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Check if category already exists
        const existing = await db.get('SELECT id FROM categories WHERE name = ?', [name]);
        if (existing) {
            return res.status(400).json({ error: 'Category already exists' });
        }
        
        const result = await db.run('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
        
        res.status(201).json({
            id: result.lastID,
            name,
            description,
            message: 'Category created successfully'
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        // Check if category exists
        const existing = await db.get('SELECT id FROM categories WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Check if new name conflicts with existing category
        if (name) {
            const nameConflict = await db.get('SELECT id FROM categories WHERE name = ? AND id != ?', [name, id]);
            if (nameConflict) {
                return res.status(400).json({ error: 'Category name already exists' });
            }
        }
        
        const updates = [];
        const params = [];
        
        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (description) {
            updates.push('description = ?');
            params.push(description);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        params.push(id);
        await db.run(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, params);
        
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if category has projects
        const projectCount = await db.get('SELECT COUNT(*) as count FROM projects WHERE category_id = ?', [id]);
        if (projectCount.count > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete category with existing projects',
                projectCount: projectCount.count
            });
        }
        
        const result = await db.run('DELETE FROM categories WHERE id = ?', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 
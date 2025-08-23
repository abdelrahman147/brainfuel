import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = './backend/database/projects.db';

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Promise wrapper for sqlite3
function promisifyRun(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

function promisifyGet(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function promisifyAll(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function initDatabase() {
    const db = new sqlite3.Database(DB_PATH);
    
    try {
        // Read and execute schema
        const schema = fs.readFileSync('./backend/database/schema.sql', 'utf8');
        await promisifyRun(db, schema);
        
        // Insert initial categories
        const categories = [
            { name: 'AI', description: 'Artificial Intelligence and Machine Learning' },
            { name: 'Robotics', description: 'Robotics and Automation' },
            { name: 'Medicine', description: 'Medical and Healthcare' },
            { name: 'Engineering', description: 'Engineering and Technology' },
            { name: 'Computer Science', description: 'Computer Science and Software' },
            { name: 'Environmental', description: 'Environmental and Sustainability' },
            { name: 'Business', description: 'Business and Entrepreneurship' },
            { name: 'Arts', description: 'Arts and Creative Projects' },
            { name: 'Social Impact', description: 'Social Impact and Community' },
            { name: 'Other', description: 'Other Categories' }
        ];
        
        for (const category of categories) {
            await promisifyRun(
                db,
                'INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)',
                [category.name, category.description]
            );
        }

        // Create a test user
        const hashedPassword = await bcrypt.hash('password123', 10);
        await promisifyRun(db, `
            INSERT OR IGNORE INTO users (username, email, password_hash, name, avatar_url, department, university)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            'testuser',
            'test@example.com',
            hashedPassword,
            'Test User',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            'Computer Science',
            'Test University'
        ]);

        // Insert sample projects
        const sampleProjects = [
            {
                title: 'AI-Powered Medical Diagnosis Assistant',
                description: 'An intelligent system that helps doctors diagnose rare diseases using machine learning and medical imaging.',
                university: 'Stanford University',
                category: 'AI',
                tags: ['Machine Learning', 'Healthcare', 'Computer Vision'],
                imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
                score: 9.8,
                supportCount: 1247,
                views: 15420,
                author: {
                    name: 'Dr. Sarah Chen',
                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
                    department: 'Computer Science'
                }
            },
            {
                title: 'Autonomous Campus Delivery Robot',
                description: 'A self-navigating robot that delivers packages and food across university campuses.',
                university: 'MIT',
                category: 'Robotics',
                tags: ['Autonomous Systems', 'Logistics', 'IoT'],
                imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
                score: 9.5,
                supportCount: 892,
                views: 12340,
                author: {
                    name: 'Alex Rodriguez',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                    department: 'Mechanical Engineering'
                }
            },
            {
                title: 'Smart Prosthetic Hand with Neural Interface',
                description: 'Advanced prosthetic hand that responds to neural signals for natural movement control.',
                university: 'UC Berkeley',
                category: 'Medicine',
                tags: ['Neural Interface', 'Biomedical', 'Prosthetics'],
                imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
                score: 9.9,
                supportCount: 2156,
                views: 28940,
                author: {
                    name: 'Dr. Michael Park',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                    department: 'Biomedical Engineering'
                }
            }
        ];

        for (const project of sampleProjects) {
            // Get category ID
            const categoryResult = await promisifyGet(db, 'SELECT id FROM categories WHERE name = ?', [project.category]);
            if (!categoryResult) {
                console.error(`Category not found for project: ${project.title}`);
                continue;
            }
            const categoryId = categoryResult.id;

            // Create author user if doesn't exist
            const authorName = project.author.name.replace(/\s+/g, '').toLowerCase();
            await promisifyRun(db, `
                INSERT OR IGNORE INTO users (username, email, password_hash, name, avatar_url, department, university)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                authorName,
                `${authorName}@example.com`,
                hashedPassword,
                project.author.name,
                project.author.avatar,
                project.author.department,
                project.university
            ]);

            const authorResult = await promisifyGet(db, 'SELECT id FROM users WHERE username = ?', [authorName]);
            const authorId = authorResult.id;

            // Insert project
            const result = await promisifyRun(db, `
                INSERT INTO projects (title, description, university, category_id, image_url, score, support_count, views, author_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                project.title,
                project.description,
                project.university,
                categoryId,
                project.imageUrl,
                project.score,
                project.supportCount,
                project.views,
                authorId
            ]);

            const projectId = result.lastID;

            // Insert tags
            for (const tag of project.tags) {
                await promisifyRun(db, 'INSERT INTO project_tags (project_id, tag_name) VALUES (?, ?)', [projectId, tag]);
            }
        }

        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        db.close();
    }
}

// Run initialization
initDatabase(); 
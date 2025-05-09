import fs from 'fs-extra';
import path from 'path';
import mysql from 'mysql2/promise';

// MySQL connection config
const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: Number.parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: {
    rejectUnauthorized: false
  },
  // Add connection pool settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000
};

// Create a connection pool (singleton)
let pool: mysql.Pool | null = null;

/**
 * Get the MySQL connection pool (created only once)
 */
export function getConnectionPool(): mysql.Pool {
  if (!pool) {
    console.log(`Creating MySQL connection pool at ${dbConfig.host}:${dbConfig.port}`);
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export type Item = {
  id: number;
  name: string;
  description?: string; // Make description optional
  image?: string;
  lottie?: string;
  attributes: any[];
  isOnTelegram?: boolean; // Keep as optional
  isOnBlockchain?: boolean; // Keep as optional
};

export type DbResult = {
  items: Item[];
  totalItems: number;
  page: number;
  totalPages: number;
};

export type GiftInfo = {
  name: string;
  total: number;
};

export type AttributeWithPercentage = {
  [key: string]: {
    [value: string]: {
      count: number;
      percentage: string;
    };
  };
};

/**
 * Connect to the MySQL database (legacy method, use with caution)
 * @deprecated Use getConnectionPool() instead for better performance
 */
export async function connectDB(): Promise<mysql.Connection> {
  try {
    console.log(`Connecting to MySQL database at ${dbConfig.host}:${dbConfig.port}`);
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    throw error;
  }
}

// Cache for frequently accessed data
interface Cache {
  attributes: Map<string, { data: AttributeWithPercentage; timestamp: number }>;
  collections: { data: GiftInfo[]; timestamp: number } | null;
  stats: Map<string, { totalItems: number; timestamp: number }>;
}

const cache: Cache = {
  attributes: new Map(),
  collections: null,
  stats: new Map()
};

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Get items from a gift collection database
 */
export async function getItems(
  giftName: string,
  page = 1,
  limit = 12,
  sort = 'id-asc',
  attributes: Record<string, string[]> = {}
): Promise<DbResult> {
  const pool = getConnectionPool();

  // Convert limit and page to numbers to ensure they're treated correctly
  const limitNum = Number(limit);
  const pageNum = Number(page);

  // Build the base query - updated to remove unavailable fields
  let baseQuery = 'SELECT id, name, image, attributes, lottie FROM items WHERE name LIKE ?';
  const params: any[] = [`${giftName}%`]; // Match names that start with the giftName

  // Apply attribute filters
  if (Object.keys(attributes).length > 0) {
    for (const [trait, values] of Object.entries(attributes)) {
      if (Array.isArray(values) && values.length > 0) {
        // For each trait and its values, we need a more flexible JSON search
        // We'll use a combination of conditions to match the trait_type and value
        const traitConditions = [];
        const valueConditions: string[] = [];

        // For each value, create a condition that checks if the JSON contains it
        values.forEach(value => {
          valueConditions.push(`JSON_SEARCH(attributes, 'one', ?) IS NOT NULL`);
          params.push(value);
        });

        // Add condition for the trait
        traitConditions.push(`JSON_SEARCH(attributes, 'one', ?) IS NOT NULL`);
        params.push(trait);

        // Add the combined condition to the query
        baseQuery += ` AND (${traitConditions.join(' OR ')}) AND (${valueConditions.join(' OR ')})`;
      }
    }
  }

  // Apply sorting
  const [field, direction] = sort.split('-');
  const sortField = field === 'id' ? 'id' : field;
  baseQuery += ` ORDER BY ${sortField} ${direction.toUpperCase()}`;

  // Count total items for pagination using the base query without LIMIT
  // We must replicate the attribute filters for count query as well
  let countQuery = 'SELECT COUNT(*) as total FROM items WHERE name LIKE ?';
  const countParams: any[] = [`${giftName}%`];

  if (Object.keys(attributes).length > 0) {
    for (const [trait, values] of Object.entries(attributes)) {
      if (Array.isArray(values) && values.length > 0) {
        const traitConditions = [];
        const valueConditions: string[] = [];

        values.forEach(value => {
          valueConditions.push(`JSON_SEARCH(attributes, 'one', ?) IS NOT NULL`);
          countParams.push(value);
        });

        traitConditions.push(`JSON_SEARCH(attributes, 'one', ?) IS NOT NULL`);
        countParams.push(trait);

        countQuery += ` AND (${traitConditions.join(' OR ')}) AND (${valueConditions.join(' OR ')})`;
      }
    }
  }

  const [countRows] = await pool.execute(countQuery, countParams);
  const totalItems = (countRows as any)[0].total;
  const totalPages = Math.ceil(totalItems / limitNum);

  // Apply pagination by adding LIMIT directly to the query string
  // This avoids issues with the prepared statement placeholders for numeric values
  const offset = (pageNum - 1) * limitNum;
  const query = `${baseQuery} LIMIT ${limitNum} OFFSET ${offset}`;

  // Execute the query
  const [rows] = await pool.execute(query, params);

  // Parse attributes JSON and add empty description and missing fields
  const parsedItems = (rows as any[]).map(item => ({
    ...item,
    description: '', // Add empty description since it's expected by the UI
    isOnTelegram: false, // Default value for missing field
    isOnBlockchain: false, // Default value for missing field
    attributes: typeof item.attributes === 'string'
      ? JSON.parse(item.attributes || '[]')
      : item.attributes
  }));

  return {
    items: parsedItems,
    totalItems,
    page: pageNum,
    totalPages,
  };
}

/**
 * Get attributes for a gift collection
 */
export async function getAttributes(giftName: string): Promise<AttributeWithPercentage> {
  const now = Date.now();
  const cached = cache.attributes.get(giftName);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const pool = getConnectionPool();

  const [rows] = await pool.execute(
    'SELECT attributes FROM items WHERE name LIKE ? AND attributes IS NOT NULL',
    [`${giftName}%`]
  );

  const attributes: Record<string, Record<string, number>> = {};

  (rows as any[]).forEach(row => {
    let attrs;
    try {
      attrs = JSON.parse(row.attributes || '[]');
    } catch (error) {
      console.warn(`Failed to parse attributes for row in ${giftName}:`, row.attributes);
      attrs = [];
    }

    attrs.forEach((attr: { trait_type: string; value: string }) => {
      const traitType = attr.trait_type;
      const value = attr.value;

      if (!attributes[traitType]) attributes[traitType] = {};
      if (!attributes[traitType][value]) attributes[traitType][value] = 0;
      attributes[traitType][value]++;
    });
  });

  // Focus specifically on Model, Backdrop, and Symbol traits
  const priorityTraits = ['Model', 'Backdrop', 'Symbol'];
  const filteredAttributes: Record<string, Record<string, number>> = {};

  priorityTraits.forEach(trait => {
    // Case-insensitive search for trait types
    const matchedTrait = Object.keys(attributes).find(
      key => key.toLowerCase() === trait.toLowerCase()
    );

    if (matchedTrait && attributes[matchedTrait]) {
      filteredAttributes[matchedTrait] = attributes[matchedTrait];
    } else if (attributes[trait]) {
      // Direct match
      filteredAttributes[trait] = attributes[trait];
    }
  });

  // Calculate percentages
  const totalItems = (rows as any[]).length || 1;
  const attributesWithPercentages: AttributeWithPercentage = {};

  Object.entries(filteredAttributes).forEach(([trait, values]) => {
    attributesWithPercentages[trait] = {};

    Object.entries(values).forEach(([value, count]) => {
      // Calculate percentage with 2 decimal places precision
      const percentage = ((count / totalItems) * 100).toFixed(2);
      attributesWithPercentages[trait][value] = { count, percentage };
    });
  });

  cache.attributes.set(giftName, { data: attributesWithPercentages, timestamp: now });

  return attributesWithPercentages;
}

/**
 * Get stats for a gift collection
 */
export async function getStats(giftName: string): Promise<{ totalItems: number }> {
  const now = Date.now();
  const cached = cache.stats.get(giftName);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return { totalItems: cached.totalItems };
  }

  const pool = getConnectionPool();

  const [rows] = await pool.execute(
    'SELECT COUNT(*) as totalItems FROM items WHERE name LIKE ?',
    [`${giftName}%`]
  );

  const totalItems = (rows as any)[0].totalItems;
  cache.stats.set(giftName, { totalItems, timestamp: now });

  return { totalItems };
}

/**
 * List all available gift collections
 */
export async function listExports(): Promise<{ db: GiftInfo[] }> {
  const now = Date.now();
  if (cache.collections && now - cache.collections.timestamp < CACHE_TTL) {
    return { db: cache.collections.data };
  }

  const pool = getConnectionPool();

  // Extract the base name (before #) to group by collection
  const [rows] = await pool.execute(
    'SELECT SUBSTRING_INDEX(name, "#", 1) as name, COUNT(*) as total FROM items GROUP BY SUBSTRING_INDEX(name, "#", 1)'
  );

  const data = rows as GiftInfo[];
  cache.collections = { data, timestamp: now };

  return { db: data };
}

/**
 * Check if a gift collection exists
 */
export async function checkFile(giftName: string): Promise<{ db: boolean }> {
  const pool = getConnectionPool();

  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM items WHERE name LIKE ?',
    [`${giftName}%`]
  );

  return { db: (rows as any)[0].count > 0 };
}

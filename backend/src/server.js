import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all checklist items (optionally filter by flightId)
app.get('/api/checklists', async (req, res) => {
  try {
    const { flightId } = req.query;
    const where = flightId ? { flightId: Number(flightId) } : {};
    const items = await prisma.checklistItem.findMany({
      where,
      orderBy: { id: 'asc' },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch checklist items' });
  }
});

// Create a checklist item
app.post('/api/checklists', async (req, res) => {
  try {
    const { flightId, title, comment, status } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const safeStatus = status === 'completed' ? 'completed' : 'pending';

    const item = await prisma.checklistItem.create({
      data: {
        flightId: flightId ? Number(flightId) : null,
        title: title.trim(),
        comment: comment ? String(comment) : '',
        status: safeStatus,
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checklist item' });
  }
});

// Update a checklist item
app.put('/api/checklists/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { title, comment, status } = req.body;

    const data = {};
    if (title !== undefined) {
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      data.title = title.trim();
    }
    if (comment !== undefined) {
      data.comment = String(comment);
    }
    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        return res
          .status(400)
          .json({ error: "Status must be either 'pending' or 'completed'" });
      }
      data.status = status;
    }

    const updated = await prisma.checklistItem.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      // Prisma "record not found"
      return res.status(404).json({ error: 'Checklist item not found' });
    }
    res.status(500).json({ error: 'Failed to update checklist item' });
  }
});

// Delete a checklist item
app.delete('/api/checklists/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    await prisma.checklistItem.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Checklist item not found' });
    }
    res.status(500).json({ error: 'Failed to delete checklist item' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});



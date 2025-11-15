import express from 'express';
import { chatWithBot, startNewConversation, clearConversation } from '../controllers/chatbotController.js';

const router = express.Router();

// Start new conversation
router.post('/new', startNewConversation);

// Chat with bot
router.post('/chat', chatWithBot);

// Clear conversation history
router.post('/clear', clearConversation);

export default router;


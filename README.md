# Makan@RP 🍕

**AI-powered Food Recommendation Platform for RP Campus**

An intelligent chatbot that helps RP campus students discover delicious food options based on their preferences. Powered by AI through n8n webhook integration.

## Features

✨ **Smart Food Recommendations** - AI-powered suggestions tailored to your taste
🎯 **Campus-Specific** - Focused on food options available at RP campus
💬 **Interactive Chat** - Real-time conversation with Snackii, our AI assistant
📍 **Location-Based Search** - Find nearby food options across campus
❓ **FAQ & Documentation** - Get quick answers to common questions

## Live Demo

Visit: [Makan@RP](https://hakimisbadatcoding.github.io/Makan-RP-Hakim/)

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Integration**: n8n Webhook
- **Deployment**: GitHub Pages
- **Storage**: Browser localStorage for chat history

## Project Structure

```
Makan-RP-Hakim/
├── index.html              # Main HTML document
├── css/
│   └── styles.css         # Complete stylesheet
├── js/
│   └── app.js             # Application logic with n8n integration
├── package.json           # Project metadata
└── README.md              # This file
```

## Installation & Setup

### Requirements
- Web browser (modern versions of Chrome, Firefox, Safari, Edge)
- No backend server required

### Local Development

**Option 1: Using Live Server (Node.js)**
```bash
npm install
npm start
```

**Option 2: Using Python**
```bash
python -m http.server 8000
```

**Option 3: Using WSL/Git Bash**
```bash
cd path/to/Makan-RP-Hakim
python -m http.server 8000
# Then open http://localhost:8000
```

## Usage

1. Open the website in your browser
2. Navigate to the **Chat** tab
3. Type your food-related questions to Snackii
4. Receive AI-powered recommendations instantly

### Example Questions

- "What should I eat for lunch?"
- "Show me vegetarian options"
- "What's available near the main canteen?"
- "I want something quick to eat"

## Features Explained

### 🏠 Home Tab
- Welcome message with feature overview
- Quick action button to start chatting
- Feature cards highlighting key capabilities

### 💬 Chat Tab
- Real-time conversation with AI chatbot
- Message history stored locally
- Typing indicators and response formatting
- Link detection in responses

### ❓ FAQ Tab
- Accordion-style collapsible answers
- Covers usage, coverage, features, and more
- Quick answers without chatting

### 📚 Docs Tab
- API documentation for webhook integration
- Integration examples
- Request/response format specifications

### ℹ️ About Us Tab
- Mission statement
- Team information
- Campus focus

### 📧 Contact Tab
- Contact form with validation
- Email and phone information
- Direct communication channel

## AI Integration Details

The chatbot is powered by n8n workflow webhook:

**Webhook URL**: `https://n8ngc.codeblazar.org/webhook/bc0df85b-ea80-4a3e-bf1a-e255b7723ccf`

**Request Format**:
```json
{
  "chatInput": "user message here"
}
```

**Response Handling**:
- Supports multiple response properties: `output`, `text`, `message`
- Automatic fallback to raw response string
- Error handling with user-friendly messages
- Response formatting with newlines and links

## Customization

### Update Contact Information

Edit `index.html` in the Contact section:
```html
<p>📧 <strong>Email:</strong> <a href="mailto:Makan@RP.com">Makan@RP.com</a></p>
<p>📞 <strong>Phone:</strong> <a href="tel:+6762353535">+67 6235 3535</a></p>
```

### Change Color Scheme

Edit `css/styles.css` variables:
```css
/* Primary Orange */
#FF7F50

/* Fresh Green */
#4CAF50

/* Navy Blue */
#2C3E50

/* Light Cream */
#FFF8F0
```

### Update Chatbot Name

Edit `js/app.js`:
```javascript
const WELCOME_MESSAGE = "Hi! I'm Snackii. I'm connected to the AI brain...";
```

## Deployment

### Deploy to GitHub Pages

1. Push changes to `main` branch:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. Ensure GitHub Pages is enabled in repository settings
3. Changes live within seconds!

### Enable HTTPS

GitHub Pages automatically provides HTTPS for your site.

## Troubleshooting

### Chatbot Not Responding
- Check n8n webhook URL in `app.js` CONFIG object
- Verify webhook endpoint is active
- Check browser console for errors (F12)

### Chat History Not Saving
- Enable localStorage in browser settings
- Clear browser cache if having issues
- Check that cookies are not blocked

### Styles Not Loading
- Clear browser cache (Ctrl+F5 on Windows, Cmd+Shift+R on Mac)
- Verify `css/styles.css` file exists
- Check file permissions

### Mobile Issues
- Website is fully responsive
- If styling looks off, clear cache
- Try different browser

## Future Enhancements

- 🗺️ Interactive campus map integration
- ⭐ User ratings and reviews system
- 📸 Food image recognition
- 🔔 Push notifications for new options
- 💳 Integration with payment systems
- 🌐 Multi-language support

## Contributing

To contribute improvements:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m "Add improvement"`)
4. Push to branch (`git push origin feature/improvement`)
5. Open Pull Request

## Credits

**Made by**: Hakim
**Platform**: GitHub Pages + n8n
**Deployed**: January 2026

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feedback:

📧 Email: Makan@RP.com
📞 Phone: +67 6235 3535

---

**Enjoy your food journey at RP Campus! 🍕🍜🍱**

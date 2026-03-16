# Apple Leaf Disease Detection — Frontend

React frontend for a real-time plant disease classifier. Upload a leaf image and get instant predictions across 38 disease classes with per-class confidence scores, powered by a custom CNN trained on the [PlantVillage dataset](https://www.tensorflow.org/datasets/catalog/plant_village).

**Live demo:** [app-dlite-net.vercel.app](https://app-dlite-net.vercel.app)  
**Backend repo:** [cnn-backend](https://github.com/Somansh1/cnn-backend)

---

## What it does

- Upload any apple leaf image (drag-and-drop or file picker)
- Sends the image to the Flask inference API
- Displays the top predicted disease class with confidence scores across all 38 classes
- Responsive layout — works on desktop and mobile

## Tech stack

- **React** with TypeScript
- **CSS** (custom, no UI framework)
- Deployed on **Vercel**

## Getting started

**Prerequisites:** Node.js >= 14, npm or yarn

```bash
git clone https://github.com/Somansh1/cnn-frontend.git
cd cnn-frontend
npm install
```

Create a `.env` file in the root and point it at your backend:

```
REACT_APP_API_URL=http://localhost:5000
```

For the live demo, this is already set to the deployed backend on Render/Heroku.

```bash
npm start        # dev server at http://localhost:3000
npm run build    # production build
```

## Project structure

```
src/
  components/    # ImageUploader, PredictionCard, ConfidenceBar
  pages/         # Home
  styles/        # Global and component CSS
  App.tsx
public/
```

## Related

- **Model:** Custom CNN, 18 MB, 99.16% accuracy on PlantVillage test set
- **Backend:** Flask API serving a `.h5` Keras model — see [cnn-backend](https://github.com/Somansh1/cnn-backend)

## License

MIT

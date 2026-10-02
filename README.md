# Apple Leaf Disease Detection: Frontend

A single-page React app where you upload a photo of an apple leaf and get back a predicted condition (Apple scab, Black rot, Cedar apple rust, or Healthy), a confidence percentage, a severity badge, and a short treatment note. The interface can be switched between English and Hindi.

The prediction is made by a separate FastAPI service: [cnn-backend](https://github.com/Somansh1/cnn-backend). This repository has no model code.

- Live app: https://appd-lite-net.vercel.app
- Backend repo: https://github.com/Somansh1/cnn-backend

## What the app does

1. You choose an image by drag and drop or the file picker. A preview is shown.
2. "Analyze Plant Health" sends it to the backend as `multipart/form-data` with the field name `file`, using `fetch`.
3. The result card shows the class name, the confidence, a severity badge, a recommendation, and a collapsible panel with the raw JSON.

The backend URL is hard-coded in `src/App.js`:

```
POST https://cnn-backend-hh6c.onrender.com/predict
```

The response it expects is:

```json
{ "class_index": 0, "class_name": "Apple scab", "confidence": 0.98 }
```

If the backend returns `{"error": "..."}` (it does so with HTTP 200 for unreadable images), the app shows that message. Any network or HTTP failure shows a generic "Failed to analyze the image" message.

### Things worth knowing about the result card

- The severity badge is not predicted by the model. It is a simple rule in `src/components/ResultsDisplay.js`: Healthy for the healthy class, Mild when confidence is below 0.7, and Moderate otherwise. In practice that means a low-confidence result is labelled "Mild", which mixes up confidence and severity.
- The treatment recommendations are text written by hand in the same file (English and Hindi). They have not been checked by a plant pathologist or agronomist and should not be used as spraying advice.
- Only the interface text and the recommendation are translated. The class name is shown as returned by the API, in English.

## Model behind it

The backend serves AppD-lite-Net, a Keras CNN with 982,980 parameters (5 convolution layers, batch normalisation, max pooling, global average pooling, 4-way softmax, 224 x 224 input) trained on the 4 apple classes of PlantVillage. Details and caveats are in the [backend README](https://github.com/Somansh1/cnn-backend#readme).

Reported results come from an unpublished manuscript by Somansh Goel and Kanika Chaudhary (equal first authors) and co-authors, not from code in either repository:

- 99.53% (632 of 635) on a held-out test set, fine-tuned model.
- 98.80% mean in 5-fold cross-validation.

The deployed model file was not re-evaluated, and the numbers are on lab-condition PlantVillage images.

## Run locally

Requires Node.js and npm. This is a Create React App project (React 19, `react-scripts` 5).

```bash
npm install
npm start      # http://localhost:3000
npm run build  # production build in build/
```

By default the app talks to the hosted Render backend. To use a local backend, run [cnn-backend](https://github.com/Somansh1/cnn-backend) and change the URL in `src/App.js` to `http://localhost:10000/predict`.

## Deployment

The frontend is deployed on Vercel at https://appd-lite-net.vercel.app, built as a standard Create React App site. The repository has no Vercel configuration file. The backend runs separately on Render.

## Limitations

- Lab images only: the model was trained and reported on PlantVillage, so field photos may give poor results.
- No upload validation in the app (file type, size, or whether the picture is a leaf). The model always answers with one of four classes. A test with a solid red image returned Black rot at confidence 1.0.
- The backend is on Render's free tier. After it has been idle, the first request can take a minute or more, and the app just shows "Analyzing..." until it wakes up.
- No training code is in this repository or the backend one.
- The deployed model file was not re-evaluated.
- The backend URL is hard-coded, not read from an environment variable.
- A research prototype, not a diagnostic service.
- Repository clutter: `axios` is listed in `package.json` but not used, `page.tsx` is a stray file that is not part of the build, and the only test is the default Create React App one.

## Observed on 2026-10-02

- `https://appd-lite-net.vercel.app` returned HTTP 200 and its page title is "React App".
- `https://cnn-backend-hh6c.onrender.com/health` returned HTTP 200 with `{"status":"ok"}`.
- An earlier link, `app-dlite-net.vercel.app`, returns HTTP 404; the correct host is `appd-lite-net`.

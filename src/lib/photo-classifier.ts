// On-device photo classification for the Donate form. Runs entirely in the
// browser via a pretrained MobileNet model (TensorFlow.js) -- no API key,
// no server call, no cost, and the photo never leaves the device just to
// get a category suggestion. Trade-off: a general-purpose 1000-class
// ImageNet model can suggest a rough category, but it has no notion of
// "condition" the way a reasoning vision model would -- that stays a
// human judgment call on the slider.

export type DonationCategory = "clothing" | "shoes" | "accessories" | "other";

export type ClassificationSuggestion = {
  category: DonationCategory;
  label: string;
  confidence: number;
};

const SHOE_KEYWORDS = ["shoe", "sandal", "clog", "boot", "loafer", "sneaker", "moccasin", "footwear"];

const ACCESSORY_KEYWORDS = [
  "purse", "backpack", "wallet", "handbag", "bag", "sunglass", "cap", "hat", "bonnet",
  "sombrero", "helmet", "wig", "necklace", "bracelet", "watch", "umbrella", "bow tie",
  "necktie", "mask", "bib", "hair slide", "shower cap", "mitten", "glove", "scarf",
];

const CLOTHING_KEYWORDS = [
  "jersey", "cardigan", "sweatshirt", "kimono", "poncho", "gown", "uniform", "bikini",
  "brassiere", "jean", "denim", "lab coat", "miniskirt", "overskirt", "pajama", "sarong",
  "trench coat", "abaya", "suit", "apron", "vestment", "robe", "coat", "skirt", "dress",
  "shirt", "sweater", "jacket", "hoodie", "blouse", "vest", "stole", "maillot",
];

// Below this, the model isn't confident enough to be worth showing.
const MIN_CONFIDENCE = 0.15;

function mapLabelToCategory(label: string): DonationCategory | null {
  const lower = label.toLowerCase();
  if (SHOE_KEYWORDS.some((k) => lower.includes(k))) return "shoes";
  if (ACCESSORY_KEYWORDS.some((k) => lower.includes(k))) return "accessories";
  if (CLOTHING_KEYWORDS.some((k) => lower.includes(k))) return "clothing";
  return null;
}

let modelPromise: Promise<import("@tensorflow-models/mobilenet").MobileNet> | null = null;

async function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const [tf, mobilenet] = await Promise.all([
        import("@tensorflow/tfjs"),
        import("@tensorflow-models/mobilenet"),
      ]);
      await tf.ready();
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })();
  }
  return modelPromise;
}

export async function classifyDonationPhoto(file: File): Promise<ClassificationSuggestion | null> {
  try {
    const model = await loadModel();
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0);

    const predictions = await model.classify(canvas);
    for (const prediction of predictions) {
      if (prediction.probability < MIN_CONFIDENCE) continue;
      const category = mapLabelToCategory(prediction.className);
      if (category) {
        return { category, label: prediction.className.split(",")[0], confidence: prediction.probability };
      }
    }
    return null;
  } catch {
    // Model failed to load or run (offline, unsupported browser, etc.) --
    // fail silently. This is an assistive suggestion, never a requirement.
    return null;
  }
}

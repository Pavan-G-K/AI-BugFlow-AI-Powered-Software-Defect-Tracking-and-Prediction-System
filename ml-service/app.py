from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

app = FastAPI(title="BugFlow Defect Prediction API", version="1.0.0")

# Small synthetic examples make this a runnable demo. Replace with labelled historical bugs for real use.
training_texts = [
    "app crash on login production critical outage", "security breach exposes customer data",
    "database data loss after deployment", "payment service completely unavailable",
    "checkout fails for all users", "API returns error on every request",
    "user cannot submit important form", "major report export failure",
    "page loads slowly under normal traffic", "search response delay",
    "button alignment is slightly wrong", "typo in help text",
    "minor icon color mismatch", "tooltip wording incorrect",
    "intermittent authentication error", "service crashes when uploading file",
    "performance slowdown in dashboard", "small padding issue in settings"
]
training_labels = [
    "CRITICAL","CRITICAL","CRITICAL","CRITICAL",
    "HIGH","HIGH","HIGH","HIGH",
    "MEDIUM","MEDIUM",
    "LOW","LOW","LOW","LOW",
    "HIGH","CRITICAL","MEDIUM","LOW"
]
model = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2), stop_words="english")),
    ("classifier", LogisticRegression(max_iter=1000, class_weight="balanced"))
])
model.fit(training_texts, training_labels)

class BugInput(BaseModel):
    title: str = Field(min_length=1, max_length=140)
    description: str = Field(min_length=1, max_length=3000)
    component: str = Field(min_length=1, max_length=100)
    environment: str = Field(min_length=1, max_length=100)

@app.get("/health")
def health():
    return {"status": "UP", "model": "TF-IDF + Logistic Regression", "training_samples": len(training_texts)}

@app.post("/predict")
def predict(bug: BugInput):
    text = " ".join([bug.title, bug.description, bug.component, bug.environment])
    probabilities = model.predict_proba([text])[0]
    index = probabilities.argmax()
    return {
        "severity": str(model.classes_[index]),
        "confidence": round(float(probabilities[index]), 3),
        "model": "TF-IDF + Logistic Regression",
        "disclaimer": "Demo model trained on synthetic examples; validate with real labelled data before operational use."
    }

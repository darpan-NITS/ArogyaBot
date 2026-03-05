from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/api", tags=["Medicine"])

# Jan Aushadhi generic medicine database
# Source: PMBI (Pradhan Mantri Bhartiya Janaushadhi Pariyojana)
MEDICINES_DB = [
    # Fever / Pain
    {"id": "1",  "brand": "Crocin",      "generic": "Paracetamol 500mg",     "price_brand": 30,  "price_generic": 2,   "category": "fever",      "use": "Fever, mild pain"},
    {"id": "2",  "brand": "Dolo 650",    "generic": "Paracetamol 650mg",     "price_brand": 35,  "price_generic": 3,   "category": "fever",      "use": "High fever, body ache"},
    {"id": "3",  "brand": "Combiflam",   "generic": "Ibuprofen+Paracetamol", "price_brand": 45,  "price_generic": 8,   "category": "pain",       "use": "Fever with inflammation"},
    {"id": "4",  "brand": "Brufen",      "generic": "Ibuprofen 400mg",       "price_brand": 40,  "price_generic": 5,   "category": "pain",       "use": "Pain, inflammation"},
    # Cold / Cough
    {"id": "5",  "brand": "Sinarest",    "generic": "Cetirizine+Paracetamol","price_brand": 55,  "price_generic": 10,  "category": "cold",       "use": "Cold, runny nose, sneezing"},
    {"id": "6",  "brand": "Benadryl",    "generic": "Diphenhydramine",       "price_brand": 60,  "price_generic": 12,  "category": "cough",      "use": "Cough, cold"},
    {"id": "7",  "brand": "Ascoril",     "generic": "Salbutamol+Guaifenesin","price_brand": 110, "price_generic": 25,  "category": "cough",      "use": "Wet cough, chest congestion"},
    {"id": "8",  "brand": "Alex",        "generic": "Chlorpheniramine",      "price_brand": 65,  "price_generic": 8,   "category": "cold",       "use": "Allergy, cold symptoms"},
    # Stomach
    {"id": "9",  "brand": "Digene",      "generic": "Magnesium Hydroxide",   "price_brand": 85,  "price_generic": 15,  "category": "stomach",    "use": "Acidity, heartburn"},
    {"id": "10", "brand": "Pan-D",       "generic": "Pantoprazole 40mg",     "price_brand": 120, "price_generic": 18,  "category": "stomach",    "use": "Acid reflux, ulcers"},
    {"id": "11", "brand": "Norflox TZ",  "generic": "Norfloxacin+Tinidazole","price_brand": 95,  "price_generic": 20,  "category": "stomach",    "use": "Diarrhea, stomach infection"},
    {"id": "12", "brand": "Ondansetron", "generic": "Ondansetron 4mg",       "price_brand": 75,  "price_generic": 10,  "category": "stomach",    "use": "Nausea, vomiting"},
    # Antibiotics
    {"id": "13", "brand": "Augmentin",   "generic": "Amoxicillin+Clavulanate","price_brand": 220,"price_generic": 45,  "category": "antibiotic", "use": "Bacterial infections"},
    {"id": "14", "brand": "Azithral",    "generic": "Azithromycin 500mg",    "price_brand": 180, "price_generic": 35,  "category": "antibiotic", "use": "Throat, chest infections"},
    {"id": "15", "brand": "Cifran",      "generic": "Ciprofloxacin 500mg",   "price_brand": 150, "price_generic": 28,  "category": "antibiotic", "use": "UTI, skin infections"},
    # Allergy
    {"id": "16", "brand": "Allegra",     "generic": "Fexofenadine 120mg",    "price_brand": 145, "price_generic": 22,  "category": "allergy",    "use": "Allergic rhinitis, hives"},
    {"id": "17", "brand": "Atarax",      "generic": "Hydroxyzine 25mg",      "price_brand": 90,  "price_generic": 15,  "category": "allergy",    "use": "Allergy, itching"},
    # Headache
    {"id": "18", "brand": "Saridon",     "generic": "Paracetamol+Caffeine",  "price_brand": 28,  "price_generic": 5,   "category": "headache",   "use": "Headache, migraine"},
    {"id": "19", "brand": "Sumatriptan", "generic": "Sumatriptan 50mg",      "price_brand": 280, "price_generic": 55,  "category": "headache",   "use": "Severe migraine"},
    # BP / Heart
    {"id": "20", "brand": "Amlodipine",  "generic": "Amlodipine 5mg",        "price_brand": 95,  "price_generic": 12,  "category": "bp",         "use": "High blood pressure"},
    {"id": "21", "brand": "Metoprolol",  "generic": "Metoprolol 50mg",       "price_brand": 85,  "price_generic": 10,  "category": "bp",         "use": "BP, heart rate control"},
    # Diabetes
    {"id": "22", "brand": "Glucophage",  "generic": "Metformin 500mg",       "price_brand": 120, "price_generic": 15,  "category": "diabetes",   "use": "Type 2 diabetes"},
    {"id": "23", "brand": "Glimepiride", "generic": "Glimepiride 1mg",       "price_brand": 95,  "price_generic": 12,  "category": "diabetes",   "use": "Blood sugar control"},
    # Skin
    {"id": "24", "brand": "Betnovate",   "generic": "Betamethasone cream",   "price_brand": 85,  "price_generic": 18,  "category": "skin",       "use": "Skin rash, inflammation"},
    {"id": "25", "brand": "Candid",      "generic": "Clotrimazole cream",    "price_brand": 75,  "price_generic": 14,  "category": "skin",       "use": "Fungal skin infection"},
]

# Symptom to medicine category mapping
SYMPTOM_CATEGORY_MAP = {
    "fever": ["fever", "pain"],
    "headache": ["headache", "fever"],
    "cough": ["cough", "cold"],
    "cold": ["cold", "allergy"],
    "runny nose": ["cold", "allergy"],
    "sneezing": ["allergy", "cold"],
    "stomach pain": ["stomach"],
    "abdominal pain": ["stomach"],
    "nausea": ["stomach"],
    "vomiting": ["stomach"],
    "diarrhea": ["stomach"],
    "acidity": ["stomach"],
    "heartburn": ["stomach"],
    "rash": ["skin", "allergy"],
    "itching": ["allergy", "skin"],
    "body ache": ["pain", "fever"],
    "chest pain": ["pain"],
    "sore throat": ["antibiotic", "cold"],
    "allergy": ["allergy"],
}


@router.get("/medicines")
async def get_medicines(
    symptoms: Optional[str] = Query(None, description="Comma separated symptoms"),
    category: Optional[str] = Query(None, description="Medicine category"),
    search: Optional[str] = Query(None, description="Search by brand or generic name"),
):
    results = MEDICINES_DB.copy()

    if search:
        search_lower = search.lower()
        results = [
            m for m in results
            if search_lower in m["brand"].lower()
            or search_lower in m["generic"].lower()
            or search_lower in m["use"].lower()
        ]

    elif symptoms:
        symptom_list = [s.strip().lower() for s in symptoms.split(",")]
        relevant_categories = set()
        for symptom in symptom_list:
            for key, cats in SYMPTOM_CATEGORY_MAP.items():
                if key in symptom or symptom in key:
                    relevant_categories.update(cats)

        if relevant_categories:
            results = [m for m in results if m["category"] in relevant_categories]

    elif category:
        results = [m for m in results if m["category"] == category.lower()]

    # Add savings calculation
    for m in results:
        m["savings_pct"] = round(
            (1 - m["price_generic"] / m["price_brand"]) * 100
        )

    return {
        "medicines": results[:10],
        "total": len(results),
        "disclaimer": "Always consult a doctor before taking any medicine.",
    }


@router.get("/medicines/search")
async def search_medicines(q: str = Query(..., description="Search query")):
    q_lower = q.lower()
    results = [
        m for m in MEDICINES_DB
        if q_lower in m["brand"].lower()
        or q_lower in m["generic"].lower()
    ]
    for m in results:
        m["savings_pct"] = round((1 - m["price_generic"] / m["price_brand"]) * 100)
    return {"medicines": results, "total": len(results)}

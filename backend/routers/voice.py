from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile, os, wave

router = APIRouter(prefix="/api", tags=["Voice"])

@router.post("/voice/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = "en"
):
    """
    Vosk offline STT fallback.
    Used when Web Speech API is unavailable (non-Chrome browsers).
    """
    try:
        from vosk import Model, KaldiRecognizer
        import json

        # Map language codes to Vosk model names
        model_map = {
            "hi": "vosk-model-small-hi-0.22",
            "en": "vosk-model-small-en-in-0.4",
        }
        model_name = model_map.get(language, "vosk-model-small-en-in-0.4")
        model_path = f"./vosk_models/{model_name}"

        if not os.path.exists(model_path):
            # Model not downloaded yet — return helpful message
            raise HTTPException(
                status_code=503,
                detail=f"Vosk model not found. Please use Chrome for voice input."
            )

        # Save uploaded audio to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Transcribe
        model = Model(model_path)
        wf = wave.open(tmp_path, "rb")
        rec = KaldiRecognizer(model, wf.getframerate())

        results = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                results.append(json.loads(rec.Result()))

        results.append(json.loads(rec.FinalResult()))
        transcript = " ".join(r.get("text", "") for r in results).strip()

        os.unlink(tmp_path)
        return {"transcript": transcript, "language": language}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

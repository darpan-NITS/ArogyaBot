from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional
from fpdf import FPDF
from datetime import datetime
import io

router = APIRouter(prefix="/api", tags=["PDF"])

class ReportData(BaseModel):
    patient_name:  Optional[str] = "Anonymous"
    session_id:    str
    symptoms:      List[str] = []
    duration:      Optional[str] = None
    severity:      Optional[str] = None
    ai_assessment: Optional[str] = None
    medicines:     List[dict] = []
    facility_name: Optional[str] = None
    language:      str = "en"

@router.post("/report/pdf")
async def generate_pdf(data: ReportData):
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_margins(20, 20, 20)

        # ── Header ──
        pdf.set_fill_color(7, 13, 15)
        pdf.rect(0, 0, 210, 40, "F")
        pdf.set_text_color(0, 201, 167)
        pdf.set_font("Helvetica", "B", 22)
        pdf.set_xy(20, 10)
        pdf.cell(0, 10, "ArogyaBot Health Summary", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(100, 150, 140)
        pdf.set_xy(20, 22)
        pdf.cell(0, 8, "AI-Powered Health Triage Report | India", ln=True)

        # Reset color
        pdf.set_text_color(30, 30, 30)
        pdf.set_xy(20, 48)

        # ── Patient Info ──
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(0, 130, 110)
        pdf.cell(0, 8, "PATIENT INFORMATION", ln=True)
        pdf.set_draw_color(0, 201, 167)
        pdf.line(20, pdf.get_y(), 190, pdf.get_y())
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(60, 7, f"Name: {data.patient_name}", ln=False)
        pdf.cell(0, 7, f"Date: {datetime.now().strftime('%d %B %Y, %I:%M %p')}", ln=True)
        pdf.cell(60, 7, f"Session ID: {data.session_id[:8].upper()}", ln=False)
        pdf.cell(0, 7, f"Language: {data.language.upper()}", ln=True)
        pdf.ln(5)

        # ── Symptoms ──
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(0, 130, 110)
        pdf.cell(0, 8, "REPORTED SYMPTOMS", ln=True)
        pdf.set_draw_color(0, 201, 167)
        pdf.line(20, pdf.get_y(), 190, pdf.get_y())
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(50, 50, 50)

        if data.symptoms:
            for symptom in data.symptoms:
                pdf.cell(8, 7, "-", ln=False)
                pdf.cell(0, 7, symptom.capitalize(), ln=True)
        else:
            pdf.cell(0, 7, "No specific symptoms extracted", ln=True)

        if data.duration:
            pdf.ln(2)
            pdf.set_font("Helvetica", "I", 10)
            pdf.set_text_color(100, 100, 100)
            pdf.cell(0, 7, f"Duration: {data.duration}", ln=True)

        pdf.ln(5)

        # ── Severity ──
        if data.severity:
            pdf.set_font("Helvetica", "B", 12)
            pdf.set_text_color(0, 130, 110)
            pdf.cell(0, 8, "TRIAGE SEVERITY", ln=True)
            pdf.set_draw_color(0, 201, 167)
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(3)

            severity_colors = {
                "mild":      (0, 180, 120),
                "moderate":  (200, 160, 0),
                "urgent":    (220, 100, 0),
                "emergency": (200, 50, 50),
            }
            color = severity_colors.get(data.severity.lower(), (0, 180, 120))
            pdf.set_fill_color(*color)
            pdf.set_text_color(255, 255, 255)
            pdf.set_font("Helvetica", "B", 11)
            pdf.cell(40, 9, f"  {data.severity.upper()}", fill=True, ln=True)
            pdf.ln(5)

        # ── AI Assessment ──
        if data.ai_assessment:
            pdf.set_text_color(30, 30, 30)
            pdf.set_font("Helvetica", "B", 12)
            pdf.set_text_color(0, 130, 110)
            pdf.cell(0, 8, "AI TRIAGE ASSESSMENT", ln=True)
            pdf.set_draw_color(0, 201, 167)
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(3)

            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(50, 50, 50)
            pdf.multi_cell(0, 6, data.ai_assessment)
            pdf.ln(5)

        # ── Medicines ──
        if data.medicines:
            pdf.set_font("Helvetica", "B", 12)
            pdf.set_text_color(0, 130, 110)
            pdf.cell(0, 8, "GENERIC MEDICINE ALTERNATIVES", ln=True)
            pdf.set_draw_color(0, 201, 167)
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(3)

            # Table header
            pdf.set_fill_color(240, 255, 252)
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(0, 100, 80)
            pdf.cell(50, 8, "Brand Name", border=1, fill=True)
            pdf.cell(70, 8, "Generic Alternative", border=1, fill=True)
            pdf.cell(25, 8, "Brand Price", border=1, fill=True)
            pdf.cell(25, 8, "Generic Price", border=1, fill=True)
            pdf.cell(0,  8, "Savings", border=1, fill=True, ln=True)

            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(50, 50, 50)
            for med in data.medicines[:6]:
                pdf.cell(50, 7, med.get("brand", ""), border=1)
                pdf.cell(70, 7, med.get("generic", ""), border=1)
                pdf.cell(25, 7, f'Rs.{med.get("price_brand", 0)}', border=1)
                pdf.cell(25, 7, f'Rs.{med.get("price_generic", 0)}', border=1)
                pdf.cell(0,  7, f'{med.get("savings_pct", 0)}% off', border=1, ln=True)
            pdf.ln(5)

        # ── Facility ──
        if data.facility_name:
            pdf.set_font("Helvetica", "B", 12)
            pdf.set_text_color(0, 130, 110)
            pdf.cell(0, 8, "RECOMMENDED FACILITY", ln=True)
            pdf.set_draw_color(0, 201, 167)
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(3)
            pdf.set_font("Helvetica", "", 11)
            pdf.set_text_color(50, 50, 50)
            pdf.cell(0, 7, data.facility_name, ln=True)
            pdf.ln(5)

        # ── Disclaimer ──
        pdf.set_font("Helvetica", "I", 9)
        pdf.set_text_color(150, 150, 150)
        pdf.ln(5)
        pdf.multi_cell(
            0, 5,
            "DISCLAIMER: This report is generated by an AI system and is for "
            "informational purposes only. It does not constitute medical advice, "
            "diagnosis, or treatment. Always consult a qualified healthcare "
            "professional for proper medical guidance. In case of emergency, "
            "call 108 immediately."
        )

        # ── Footer ──
        pdf.set_y(-20)
        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, "Generated by ArogyaBot | AI Health Triage for India | arogyabot.vercel.app", align="C")

        # Output PDF as bytes
        pdf_bytes = pdf.output()

        return Response(
            content=bytes(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=arogyabot_report_{data.session_id[:8]}.pdf"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

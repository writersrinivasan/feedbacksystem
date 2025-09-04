import openai
from app.core.config import settings
from app.schemas.schemas import AIAnalysisCreate
from datetime import datetime
from typing import List
import json

openai.api_key = settings.OPENAI_API_KEY

def generate_ai_feedback_analysis(feedback_list: List) -> AIAnalysisCreate:
    # Prepare feedback data for analysis
    feedback_text = "\n".join([
        f"Content: {f.content_rating}/5, Delivery: {f.delivery_rating}/5, "
        f"Engagement: {f.engagement_rating}/5, Comments: {f.comments}"
        for f in feedback_list
    ])

    # Create prompt for GPT
    prompt = f"""
    Analyze the following student feedback for a medical college professor:
    {feedback_text}
    
    Please provide:
    1. Overall sentiment score (0-1)
    2. Key strengths
    3. Areas for improvement
    4. Specific suggestions for enhancement
    
    Format the response as JSON with keys: sentiment_score, strengths, areas_for_improvement, suggestions
    """

    # Get analysis from GPT
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert educational consultant analyzing medical faculty feedback."},
            {"role": "user", "content": prompt}
        ]
    )

    # Parse the response
    try:
        analysis = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        # Fallback to a basic analysis if JSON parsing fails
        analysis = {
            "sentiment_score": 0.5,
            "strengths": "Analysis pending",
            "areas_for_improvement": "Analysis pending",
            "suggestions": "Analysis pending"
        }

    return AIAnalysisCreate(
        teacher_id=feedback_list[0].teacher_id if feedback_list else None,
        analysis_date=datetime.now(),
        sentiment_score=float(analysis["sentiment_score"]),
        strengths=analysis["strengths"],
        areas_for_improvement=analysis["areas_for_improvement"],
        suggestions=analysis["suggestions"]
    )

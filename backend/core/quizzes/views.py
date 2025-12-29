from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from accounts.models import User
from courses.models import Course
from .models import Quiz, Question, Option
from enrollments.models import Enrollment
from quizzes.models import Quiz, QuizAttempt
from accounts.models import User





@api_view(['POST'])
def create_quiz(request):
    title = request.data.get("title")
    course_id = request.data.get("course_id")

    if not title or not course_id:
        return Response(
            {"error": "Title and course_id are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # TEMP instructor (same pattern as your courses)
    try:
        instructor = User.objects.get(email="instructor@gmail.com")
    except User.DoesNotExist:
        return Response(
            {"error": "Instructor not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "Course not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    quiz = Quiz.objects.create(
        title=title,
        course=course,
        created_by=instructor
    )

    return Response(
        {
            "message": "Quiz created successfully",
            "quiz_id": quiz.id
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def add_question(request, quiz_id):
    question_text = request.data.get("question")
    options = request.data.get("options")

    if not question_text:
        return Response({"error": "Question is required"}, status=400)

    if not options or len(options) < 2:
        return Response(
            {"error": "At least 2 options required"},
            status=400
        )

    if not any(opt.get("is_correct") for opt in options):
        return Response(
            {"error": "At least one correct option required"},
            status=400
        )

    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response(
            {"error": "Quiz not found"},
            status=404
        )

    question = Question.objects.create(
        quiz=quiz,
        question_text=question_text
    )

    for opt in options:
        Option.objects.create(
            question=question,
            option_text=opt.get("text"),
            is_correct=opt.get("is_correct", False)
        )

    return Response(
        {"message": "Question added successfully"},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
def quiz_detail(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=404)

    return Response({
        "id": quiz.id,
        "title": quiz.title,
        "questions": [
            {
                "id": q.id,
                "question": q.question_text,
                "options": [
                    {
                        "id": o.id,
                        "text": o.option_text,
                        "is_correct": o.is_correct
                    }
                    for o in q.options.all()
                ]
            }
            for q in quiz.questions.all()
        ]
    })



@api_view(["GET"])
def student_quizzes(request):
    student_id = request.GET.get("student_id")

    if not student_id:
        return Response({"error": "student_id required"}, status=400)

    try:
        student = User.objects.get(id=student_id)
        if student.role != "STUDENT":
            return Response({"error": "Not a student"}, status=403)
    except User.DoesNotExist:
        return Response({"error": "Invalid student"}, status=404)

    # Courses assigned to student
    course_ids = Enrollment.objects.filter(
        student=student
    ).values_list("course_id", flat=True)

    quizzes = Quiz.objects.filter(course_id__in=course_ids)

    data = []
    for quiz in quizzes:
        attempted = QuizAttempt.objects.filter(
            quiz=quiz,
            student=student
        ).exists()

        data.append({
            "id": quiz.id,
            "title": quiz.title,
            "course": quiz.course.title,
            "attempted": attempted
        })

    return Response(data)





@api_view(["GET"])
def quiz_questions(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=404)

    questions = Question.objects.filter(quiz=quiz)

    data = []
    for q in questions:
        options = Option.objects.filter(question=q).values_list(
            "option_text", flat=True   # ✅ FIX HERE
        )

        data.append({
            "id": q.id,
            "question": q.question_text,
            "options": list(options)
        })

    return Response(data)




@api_view(["POST"])
def submit_quiz(request):
    student_id = request.data.get("student_id")
    quiz_id = request.data.get("quiz_id")
    answers = request.data.get("answers")

    if not student_id or not quiz_id or not isinstance(answers, dict):
        return Response({"error": "Invalid payload"}, status=400)

    try:
        student = User.objects.get(id=student_id)
        quiz = Quiz.objects.get(id=quiz_id)
    except (User.DoesNotExist, Quiz.DoesNotExist):
        return Response({"error": "Invalid student or quiz"}, status=404)

    # Prevent re-attempt
    if QuizAttempt.objects.filter(student=student, quiz=quiz).exists():
        return Response({"error": "Quiz already attempted"}, status=403)

    score = 0
    total = 0

    questions = Question.objects.filter(quiz=quiz)

    for question in questions:
        total += 1
        correct_option = Option.objects.filter(
            question=question,
            is_correct=True
        ).first()

        selected = answers.get(str(question.id))

        if selected and correct_option and selected == correct_option.option_text:
            score += 1

    QuizAttempt.objects.create(
        student=student,
        quiz=quiz,
        score=score,
        total_marks=total
    )

    return Response({
        "score": score,
        "total_marks": total,
        "percentage": int((score / total) * 100) if total > 0 else 0
    })

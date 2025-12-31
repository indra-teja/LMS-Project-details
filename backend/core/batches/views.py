@api_view(["GET"])
def list_batches(request):
    course_id = request.GET.get("course_id")

    batches = Batch.objects.all()

    if course_id:
        batches = batches.filter(course_id=course_id)

    data = batches.values(
        "id",
        "name",
        "course__title",
        "start_date",
        "end_date",
        "is_active"
    )

    return Response(data)

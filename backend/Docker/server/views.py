from django.http import HttpResponse
from backend.Docker.server.models import Item


def all_items(request):
    if request.method == "GET":
        Item.objects.create
        return HttpResponse("Hello World!")

def item(request, itemid):
    return HttpResponse("Hello World!")
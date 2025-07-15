from django.http import HttpResponse


def all_items(request):
    return HttpResponse("Hello World!")

def item(request, itemid):
    return HttpResponse("Hello World!")
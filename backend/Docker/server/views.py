from django.http import HttpResponse
from server.models import Item
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def all_items(request):
    if request.method == "GET":
        all_items = Item.objects.all()
        data = serializers.serialize("json", all_items)
        return HttpResponse(data, content_type="application/json")
    if request.method == "POST":
        try:
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            Item.objects.create(**body_data)
            return HttpResponse("success!", content_type="application/json")
        except json.JSONDecodeError:
            return HttpResponse(json.dumps({"error": "Invalid JSON"}), content_type="application/json", status=400)
        except TypeError as e:
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json", status=400)
        except Exception as e:
            return HttpResponse(json.dumps({"error": "Server error", "details": str(e)}), content_type="application/json", status=500)

@csrf_exempt
def item(request, itemid):
    return HttpResponse("Hello World!")